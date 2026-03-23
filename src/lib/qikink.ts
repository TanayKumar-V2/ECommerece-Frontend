import Order from '../models/Order';
import dbConnect from './db';

const QIKINK_API_KEY = process.env.QIKINK_API_KEY || '';
const QIKINK_API_SECRET = process.env.QIKINK_API_SECRET || '';

// Determine Base URL (Sandbox vs Live)
// Default to sandbox as requested by user
const QIKINK_BASE_URL = process.env.QIKINK_API_URL 
  ? new URL(process.env.QIKINK_API_URL).origin 
  : 'https://sandbox.qikink.com';


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

    // 1. Fetch Qikink Access Token
    const tokenUrl = `${QIKINK_BASE_URL}/api/token`;
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

    // 2. Create the Order
    const b2bPayload = {
      order_number: orderId.toString().slice(-10), // Required unique string
      qikink_shipping: "1",
      gateway: "Prepaid",
      total_order_value: order.totalAmount.toString(),
      line_items: order.products.map((item: any) => {
        // Support dynamic SKU construction for variations
        let finalSku = item.product.qikink_sku;
        if (finalSku && !finalSku.includes('-') && item.color && item.size) {
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

        return {
          search_from_my_products: 1, // Assume SKU is linked
          quantity: item.quantity.toString(),
          sku: finalSku
        };
      }),
      shipping_address: {
        first_name: order.shippingAddress.name.split(' ')[0] || 'Customer',
        last_name: order.shippingAddress.name.split(' ').slice(1).join(' ') || '',
        address1: order.shippingAddress.addressLine1,
        phone: order.shippingAddress.phone,
        email: order.user ? `user-${order.user}@viraasat.com` : "customer@viraasat.com",
        city: order.shippingAddress.city,
        zip: order.shippingAddress.pincode,
        province: order.shippingAddress.state,
        country_code: "IN"
      }
    };

    const response = await fetch(`${QIKINK_BASE_URL}/api/order/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'ClientId': QIKINK_API_KEY,
            'Accesstoken': Accesstoken
        },
        body: JSON.stringify(b2bPayload)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(`Qikink API Error: ${response.status} - ${JSON.stringify(data)}`);
    }

    // Update order status if successful
    await Order.findByIdAndUpdate(orderId, { status: 'processing' });
    console.log(`Successfully pushed order ${orderId} to Qikink. Response:`, data);
    return { success: true, data };

  } catch (error) {
    console.error(`Failed to push order ${orderId} to Qikink:`, error);
    // Note: We don't throw here so that the payment verification process still completes
    return { success: false, error };
  }
}
