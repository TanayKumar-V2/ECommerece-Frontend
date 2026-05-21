require('dotenv').config({ path: '.env.local' });
const { pushOrderToQikink } = require('./src/lib/qikink');

async function test() {
  const orderId = '69c14f27bc10e681f9f92d47';
  console.log(`Manually retrying push for order ${orderId}...`);
  try {
    const result = await pushOrderToQikink(orderId);
    console.log('Push Result:', JSON.stringify(result, null, 2));
  } catch (err) {
    console.error('Push Failed:', err);
  }
}
test();
