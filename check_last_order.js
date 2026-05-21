const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://Tanay:tanay@cluster0.3l8ik88.mongodb.net/Viraasat?appName=Cluster0";

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("Viraasat");
    const collection = db.collection("orders");
    const lastOrder = await collection.findOne({}, { sort: { createdAt: -1 } });
    console.log(JSON.stringify(lastOrder, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}
run();
