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
const ROOT_URL = 'https://sandbox.qikink.com';

async function probe() {
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

     const tests = [
       { url: `${ROOT_URL}/api/order`, header: 'Accesstoken' },
       { url: `${ROOT_URL}/api/order`, header: 'accesstoken' },
       { url: `${ROOT_URL}/api/v1/order/create`, header: 'Accesstoken' },
       { url: `${ROOT_URL}/api/order/create`, header: 'Accesstoken' }
     ];

     for (const t of tests) {
       console.log(`Probing POST ${t.url} with header '${t.header}'`);
       const headers = {
         'Content-Type': 'application/json',
         'ClientId': QIKINK_API_KEY
       };
       headers[t.header] = token;

       const res = await fetch(t.url, {
         method: 'POST',
         headers: headers,
         body: JSON.stringify({ order_number: 'probe_' + Date.now(), qikink_shipping: "1", gateway: "Prepaid", total_order_value: "1", line_items: [] }) 
       });
       console.log(`- Status: ${res.status}`);
       const text = await res.text();
       console.log(`- Response: ${text.substring(0, 100)}`);
     }

  } catch (err) {
    console.error('Probe failed:', err);
  }
}
probe();
