


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
const QIKINK_BASE_URL = 'https://sandbox.qikink.com/api';

async function runTest() {
  console.log(`Final Verification...`);

  try {
     const params = new URLSearchParams();
     params.append('ClientId', QIKINK_API_KEY);
     params.append('client_secret', QIKINK_API_SECRET);

     const tokenRes = await fetch(`https://sandbox.qikink.com/api/token`, {
       method: 'POST',
       headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
       body: params.toString()
     });
     const tokenData = await tokenRes.json();
     const token = tokenData.Accesstoken;

     const payload = {
       "order_number": "FIN_" + Date.now().toString().slice(-8), 
       "qikink_shipping": "1",
       "gateway": "Prepaid",
       "total_order_value": "999",
       "line_items": [
         {
           "search_from_my_products": 1,
           "quantity": "1",
           "price": "999",
           "sku": "MVnHs-Wh-S"
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

     const res = await fetch(`${QIKINK_BASE_URL}/order/create`, {
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
