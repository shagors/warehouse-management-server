const express = require("express");
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const {
    MongoClient,
    ServerApiVersion,
    ObjectId
} = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();

// warehouseDB
// QpIwV5rIfsGbeg7p

// middleware
app.use(cors());
app.use(express.json());

function verifyJWT(req, res, next){
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).send({message: 'unauthorized access'});
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if(err){
            return res.status(403).send({message: 'Forbidden access'})
        }
        req.decoded = decoded;
    })
    next();
}

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fooxh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1
});

async function run() {
        try {
            await client.connect();
            const productCollection = client.db('warehouse').collection('products');

            // JWT Auth
            app.post('/login', async(req,res) => {
                const user = req.body;
                const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                    expiresIn: '2d'
                });
                res.send({accessToken});
            })

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

        // POST
        app.post('/products', async(req, res) => {
            const newProduct = req.body;
            const result = await productCollection.insertOne(newProduct);
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