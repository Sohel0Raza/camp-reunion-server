const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config();
const app = express()
const port = process.env.PORT || 5000;

//middelwire
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q6zwl04.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const classesCollection = client.db('campReunionDB').collection('classes')
    const selectCollection = client.db('campReunionDB').collection('selectClass')

    //classes 
    app.get('/allClass', async(req, res)=>{
        const result = await classesCollection.find().toArray()
        res.send(result)
    })
    app.get('/populerClass', async(req, res)=>{
        const query = {}
        const options ={
            sort:{"available_seats": -1}
        }
        const result = await classesCollection.find(query,options).limit(6).toArray()
        res.send(result)
    })
    app.get('/populerInstructor', async(req, res)=>{
        const query = {}
        const options ={
            sort:{"available_seats": -1}
        }
        const result = await classesCollection.find(query,options).limit(6).toArray()
        res.send(result)
    })

    //select classes
    app.get('/selectClass', async(req,res)=>{
      const email = req.query.email;
      if(!email){
        res.send([])
      }
      const query = {email: email}
      const result = await selectCollection.find(query).toArray()
      res.send(result)
    })
    app.post('/selectClass', async(req, res) =>{
      const selectClass = req.body;
      const result = await selectCollection.insertOne(selectClass)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res)=>{
    res.send('CampReunion is running...........')
})
app.listen(port,()=>{
    console.log(`CampReunio is running on port:${port}`)
})