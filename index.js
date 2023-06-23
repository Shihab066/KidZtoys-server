const express = require('express');
const cors = require('cors')
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

//middleWare
// app.use(cors());
app.use(express.json());
// const corsOptions ={
//     origin:'*',
//     credentials:true,
//     optionSuccessStatus:200,
//     }
// app.use(cors(corsOptions))

const corsConfig = {
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
app.use(cors(corsConfig))
app.options("", cors(corsConfig))



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cxwtjms.mongodb.net/?retryWrites=true&w=majority`;

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
        // client.connect();

        const toysCollection = client.db('ToysDB').collection('LegoToys');

        app.get('/toy', async (req, res) => {
            const cursor = toysCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/toys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const toy = await toysCollection.findOne(query);
            res.send(toy)
        })
        

        app.get('/toy/:cid', async(req, res) => {
            const category = req.params.cid;            
            const query = { subCategory: category }
            console.log(category)
            const cursor = toysCollection.find(query)
            const toys = await cursor.toArray()
            res.send(toys);
        })

        app.get('/myToys/:id', async (req, res) => {
            const email = req.params.id;
            const query = { Email: email};
            const cursor = toysCollection.find(query);
            const toys = await cursor.toArray();
            res.send(toys)
        })
        
        app.post('/toy', async (req, res) => {
            const toy = req.body;
            const result = await toysCollection.insertOne(toy)
            res.send(result)
        })

        app.delete('/myToys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await toysCollection.deleteOne(query);
            res.send(result);
        })

        app.put('/myToys/:id', async (req, res) => {
            const id = req.params.id;
            const toy = req.body;
            const { price, quantity, description } = toy;
            const query = { _id: new ObjectId(id) };
            const options = { upsert: false };
            const updateToy = {
                $set: {
                    price: price,
                    quantity: quantity,
                    description: description
                }
            }
            const result = await toysCollection.updateOne(query, updateToy, options);
            res.send(result)
        })






        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send("toy store server running")
})

app.listen(port, () => {
    console.log(`server is running on port: ${port}`)
})