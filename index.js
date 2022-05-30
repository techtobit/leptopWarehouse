const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const cors = require('cors');
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())


// const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.lcuk6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const uri = "mongodb+srv://letptopHouse:letptopHouse@cluster0.ozyky.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {

 try {
  await client.connect();
  const inventoryCollection = client.db('wareHouse').collection("leptops");
  const addProductCollection = client.db('wareHouse').collection("addProduct");



  app.get('/inventorys', async (req, res) => {
   const cursor = inventoryCollection.find({});
   const inventory = await cursor.toArray();
   res.send(inventory);
  })


  app.get('/inventorys/:id', async (req, res) => {
   const id = req.params.id;
   const query = { _id: ObjectId(id) };
   const item = await inventoryCollection.findOne(query)
   res.send(item);
  })


  //Update Items Quantity
  app.put('/inventorys/:id', async (req, res) => {
   const id = req.params.id;
   const updateQuantity = req.body;
   const filter = { _id: ObjectId(id) };
   const options = { upsert: true };
   const upDateQuantity = {
    $set: {
     quantity: updateQuantity.quantity
    }
   }
   const totalQuantity = await inventoryCollection.updateOne(filter, upDateQuantity, options)

   res.send(totalQuantity);
  })

  //gett added new a items 
  app.get('/addedProduct', async (req, res) => {
   const cursor = addProductCollection.find({});
   const inventory = await cursor.toArray();
   res.send(inventory);
  })


  //add new a items 
  app.post('/addProduct', async (req, res) => {
   const newItem = req.body;
   const item = await addProductCollection.insertOne(newItem);
   res.send(item)
  })



  // Delete a product sight finished
  app.delete('/inventorys/:id', async (req, res) => {
   const id = req.params.id;
   const filter = { _id: ObjectId(id) };
   const result = await inventoryCollection.deleteOne(filter);
   res.send(result);
  });

 } catch (error) {
  // console.log();
 }

}

run().catch(console.dir);

app.get('/', (req, res) => {
 res.send('hello world!')
})


app.listen(port, () => {
 console.log(`Node Express is Running from ${port}`);
})