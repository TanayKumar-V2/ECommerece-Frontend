const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, ...rest] = line.trim().split('=');
  if (key && rest.length) env[key] = rest.join('=').replace(/^"(.*)"$/, '$1');
});

const QIKINK_API_KEY = env.QIKINK_API_KEY;
const QIKINK_API_SECRET = env.QIKINK_API_SECRET;
const QIKINK_BASE_URL = env.QIKINK_API_URL || 'https://sandbox.qikink.com/api/v1';
const ROOT_URL = new URL(QIKINK_BASE_URL).origin;

async function runTest() {
  const orderId = '69c14f27bc10e681f9f92d47';
  console.log(`Final Test for Order: ${orderId}`);

  try {
     const params = new URLSearchParams();
     params.append('ClientId', QIKINK_API_KEY);
     params.append('client_secret', QIKINK_API_SECRET);

     const tokenRes = await fetch(`${ROOT_URL}/api/token`, {
       method: 'POST',
       headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
       body: params.toString()
     });
     const tokenData = await tokenRes.json();
     const token = tokenData.Accesstoken;
     console.log('Token OK.');

     const payload = {
       "order_number": "TX_" + Date.now().toString().slice(-8), // Guaranteed unique
       "qikink_shipping": "1",
       "gateway": "Prepaid",
       "total_order_value": "999",
       "line_items": [
         {
           "search_from_my_products": 1,
           "quantity": "1",
           "price": "999",
           "sku": "UOSsMRnHs-Wh-XS"
         }
       ],
       "shipping_address": {
         "first_name": "Tanay",
         "last_name": "Kumar",
         "address1": "Poorvi Marg,Vasant Vihar,New Delhi-110057",
         "phone": "07428624740",
         "email": "user-69aeca130f42bb69ea3fd94a@viraasat.com",
         "city": "New Delhi",
         "zip": "110057",
         "province": "Delhi",
         "country_code": "IN"
       }
     };

     const createUrl = QIKINK_BASE_URL.endsWith('/api/v1') 
       ? `${QIKINK_BASE_URL}/order/create` 
       : `${QIKINK_BASE_URL}/api/v1/order/create`;

     console.log(`Fetching: ${createUrl}`);

     const res = await fetch(createUrl, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         'ClientId': QIKINK_API_KEY,
         'Accesstoken': token
       },
       body: JSON.stringify(payload)
     });

     const data = await res.json();
     console.log('Result:', JSON.stringify(data, null, 2));

  } catch (err) {
    console.error('Test script error:', err);
  }
}
runTest();
