const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.schfv1q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        
        const serviceCollection = client.db("petcornerDB").collection("services");
        const reviewCollection = client.db("petcornerDB").collection("reviews");

        // get services result
        app.get('/services', async(req,res) =>{
            const result = await serviceCollection.find().toArray();
            res.send(result);
        })
        // get reviews result
        app.get('/reviews', async(req,res) =>{
            const result = await reviewCollection.find().toArray();
            res.send(result);
        } )

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




// db starting message
app.get('/', (req, res) => {
    res.send('backend started');
})

app.listen(port, () => {
    console.log(`backend is running on port ${port}`)
})