const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://Tanay:tanay@cluster0.3l8ik88.mongodb.net/Viraasat?appName=Cluster0";

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("Viraasat");
    const collection = db.collection("orders");
    const lastOrder = await collection.find({}).sort({ createdAt: -1 }).limit(1).toArray();
    console.log(JSON.stringify(lastOrder[0], null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}
run();
