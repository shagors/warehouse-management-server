const express = require("express");
const cors = require('cors');
const jwt = require('jsonwebtoken');
const {
    MongoClient,
    ServerApiVersion,
    ObjectId
} = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

// warehouseDB
// QpIwV5rIfsGbeg7p

// middleware
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://warehouseDB:QpIwV5rIfsGbeg7p@cluster0.fooxh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1
});

async function run() {
        try {
            await client.connect();
            const productCollection = client.db('warehouse').collection('products');

        app.get('/products', async(req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });

        app.get('/products/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const product = await productCollection.findOne(query);
            res.send(product);
        });

        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await productCollection.deleteOne(query);
            res.send(result);
        });

    }
    finally{

    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})