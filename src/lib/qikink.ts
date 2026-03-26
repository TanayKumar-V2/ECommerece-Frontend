import Order from '../models/Order';
import dbConnect from './db';
import fs from 'fs';
import path from 'path';

const QIKINK_API_KEY = process.env.QIKINK_API_KEY || '';
const QIKINK_API_SECRET = process.env.QIKINK_API_SECRET || '';
const QIKINK_PRINT_TYPE_ID = Number(process.env.QIKINK_PRINT_TYPE_ID || 1);
const QIKINK_DEFAULT_DESIGN_WIDTH = process.env.QIKINK_DEFAULT_DESIGN_WIDTH || '10';
const QIKINK_DEFAULT_DESIGN_HEIGHT = process.env.QIKINK_DEFAULT_DESIGN_HEIGHT || '12';
const QIKINK_DEFAULT_FULFILLMENT_MODE =
  process.env.QIKINK_DEFAULT_FULFILLMENT_MODE === 'my_products' ? 'my_products' : 'catalog_design';

// Auth and order endpoints must target the same Qikink environment.
const QIKINK_ROOT_URL = process.env.QIKINK_API_URL
  ? new URL(process.env.QIKINK_API_URL).origin
  : 'https://sandbox.qikink.com';
// Base URL for Qikink API
const QIKINK_BASE_URL = process.env.QIKINK_API_URL 
  ? new URL(process.env.QIKINK_API_URL).origin + '/api'
  : 'https://sandbox.qikink.com/api';

type FulfillmentMode = 'catalog_design' | 'my_products';

type QikinkProduct = {
  _id: { toString(): string };
  title: string;
  price: number;
  images?: string[];
  qikink_sku: string;
  qikinkFulfillmentMode?: FulfillmentMode;
  qikinkDesignUrl?: string;
  qikinkMockupUrl?: string;
  qikinkDesignCode?: string;
  qikinkPlacementSku?: string;
  qikinkPrintTypeId?: number;
};

type QikinkOrderItem = {
  product: QikinkProduct;
  quantity: number;
  size?: string;
  color?: string;
};

function safeDesignCode(input: string) {
  return input
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 20) || `d-${Date.now().toString().slice(-8)}`;
}

function resolveFulfillmentMode(product: QikinkProduct): FulfillmentMode {
  if (product.qikinkFulfillmentMode === 'my_products') {
    return 'my_products';
  }
  if (product.qikinkFulfillmentMode === 'catalog_design') {
    return 'catalog_design';
  }
  return QIKINK_DEFAULT_FULFILLMENT_MODE;
}

function assertPublicAssetUrl(url: string, label: string) {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error(`${label} must be an absolute public URL for Qikink`);
  }

  const hostname = parsed.hostname.toLowerCase();
  if (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '0.0.0.0' ||
    hostname.endsWith('.local')
  ) {
    throw new Error(`${label} cannot point to localhost for Qikink fulfillment`);
  }
}

function buildSku(item: QikinkOrderItem, mode: FulfillmentMode) {
  let finalSku = item.product.qikink_sku;

  if (mode === 'catalog_design' && finalSku && !finalSku.includes('-') && item.color && item.size) {
    const colorMap: Record<string, string> = {
      'White': 'Wh',
      'Black': 'Bk',
      'Red': 'Rd',
      'Navy Blue': 'NB',
      'Royal Blue': 'RB',
      'Maroon': 'Mr',
      'Grey': 'Gy',
      'Yellow': 'Yl',
      'Light Baby Pink': 'LBp',
      'Lavender': 'Lv',
    };
    const colorCode = colorMap[item.color] || item.color.substring(0, 2);
    finalSku = `${finalSku}-${colorCode}-${item.size}`;
  }
  return finalSku;
}

function buildLineItems(order: { products: QikinkOrderItem[] }) {
  return order.products.map((item) => {
    const mode = resolveFulfillmentMode(item.product);
    const sku = buildSku(item, mode);

    if (mode === 'catalog_design') {
      const designUrl = item.product.qikinkDesignUrl || item.product.images?.[0];
      const mockupUrl = item.product.qikinkMockupUrl || designUrl;

      if (!designUrl) {
        throw new Error(
          `Product ${item.product._id} is using catalog_design fulfillment but has no design URL or product image`
        );
      }

      assertPublicAssetUrl(designUrl, `Product ${item.product._id} design URL`);
      if (mockupUrl) {
        assertPublicAssetUrl(mockupUrl, `Product ${item.product._id} mockup URL`);
      }

      const designCode =
        item.product.qikinkDesignCode ||
        safeDesignCode(`${item.product.title}-${item.product._id.toString().slice(-6)}`);

      return {
        search_from_my_products: 0,
        quantity: item.quantity.toString(),
        print_type_id: item.product.qikinkPrintTypeId || QIKINK_PRINT_TYPE_ID,
        price: item.product.price.toString(),
        sku,
        designs: [
          {
            design_code: designCode,
            width_inches: QIKINK_DEFAULT_DESIGN_WIDTH,
            height_inches: QIKINK_DEFAULT_DESIGN_HEIGHT,
            placement_sku: item.product.qikinkPlacementSku || 'fr',
            design_link: designUrl,
            mockup_link: mockupUrl,
          },
        ],
      };
    }

    return {
      search_from_my_products: 1,
      quantity: item.quantity.toString(),
      price: item.product.price.toString(),
      sku,
    };
  });
}

async function postQikinkOrder(payload: any, token: string) {
  const response = await fetch(`${QIKINK_BASE_URL}/order/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'ClientId': QIKINK_API_KEY,
      'Accesstoken': token
    },
    body: JSON.stringify(payload)
  });

  const responseText = await response.text();
  let data: any = responseText;
  try {
    data = JSON.parse(responseText);
  } catch {
    // Keep raw text when Qikink does not return JSON.
  }
  return { response, data };
}

export async function pushOrderToQikink(orderId: string) {
  try {
    await dbConnect();
    // Populate the product details to get qikink_sku
    const order = await Order.findById(orderId).populate('products.product');

    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    if (order.status !== 'paid') {
      throw new Error(`Order ${orderId} is not paid. Status: ${order.status}`);
    }

    // 1. Fetch Qikink Access Token (Auth endpoint usually at /api/token)
    const tokenUrl = `${QIKINK_ROOT_URL}/api/token`;
    const params = new URLSearchParams();
    params.append('ClientId', QIKINK_API_KEY);
    params.append('client_secret', QIKINK_API_SECRET);

    const tokenRes = await fetch(tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
    });
    
    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.Accesstoken) {
        throw new Error(`Qikink Auth Error: ${JSON.stringify(tokenData)}`);
    }

    const { Accesstoken } = tokenData;

    const shippingEmail =
      order.shippingAddress.email || (order.user ? `user-${order.user}@viraasat.com` : "customer@viraasat.com");

    const payload = {
      order_number: orderId.toString().slice(-10), // Required unique string
      qikink_shipping: "1",
      gateway: "Prepaid",
      total_order_value: order.totalAmount.toString(),
      line_items: buildLineItems(order),
      shipping_address: {
        first_name: order.shippingAddress.name.split(' ')[0] || 'Customer',
        last_name: order.shippingAddress.name.split(' ').slice(1).join(' ') || '',
        address1: order.shippingAddress.addressLine1,
        phone: order.shippingAddress.phone,
        email: shippingEmail,
        city: order.shippingAddress.city,
        zip: order.shippingAddress.pincode,
        province: order.shippingAddress.state,
        country_code: "IN"
      }
    };

    try {
      const logMsg = `\n--- ${new Date().toISOString()} ---\nOrderId: ${orderId}\nPayload: ${JSON.stringify(payload, null, 2)}\n`;
      fs.appendFileSync(path.join(process.cwd(), 'qikink_debug.log'), logMsg);
    } catch (e) {
      console.error("Failed to write debug log:", e);
    }

    const { response, data } = await postQikinkOrder(payload, Accesstoken);

    try {
      const logRes = `Response: ${JSON.stringify(data, null, 2)}\n`;
      fs.appendFileSync(path.join(process.cwd(), 'qikink_debug.log'), logRes);
    } catch (e) {
      console.error("Failed to write debug log response:", e);
    }

    if (!response.ok) {
      const errorMessage = `${response.status} - ${JSON.stringify(data)}`;
      await Order.findByIdAndUpdate(orderId, {
        $set: {
          qikinkLastAttemptAt: new Date(),
          qikinkLastError: `Qikink API Error: ${errorMessage}`,
        },
      });
      throw new Error(`Qikink API Error: ${errorMessage}`);
    }

    const successSet: Record<string, any> = {
      status: 'processing',
      qikinkFulfilledAt: new Date(),
      qikinkLastAttemptAt: new Date(),
    };

    if (data?.order_id) {
      successSet.qikinkOrderId = String(data.order_id);
    }

    await Order.findByIdAndUpdate(orderId, {
      $set: successSet,
      $unset: { qikinkLastError: 1 },
    });
    console.log(`Successfully pushed order ${orderId} to Qikink. Response:`, data);
    return { success: true, data };

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    try {
      await Order.findByIdAndUpdate(orderId, {
        $set: {
          qikinkLastAttemptAt: new Date(),
          qikinkLastError: message,
        },
      });
    } catch (dbError) {
      console.error(`Failed to persist Qikink error for order ${orderId}:`, dbError);
    }
    console.error(`Failed to push order ${orderId} to Qikink:`, error);
    // CRITICAL: We throw the error so the calling verify/route.ts can catch it if needed.
    throw error;
  }
}
