const express = require("express");
const app = express();
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require("dotenv").config();

const port = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b9zut.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri)

async function run() {
    try {
        await client.connect();
        // console.log("database successfully connected")
        const database = client.db("JUM_MOTORS");
        const productsCollection = database.collection("products");

        // get Products
        app.get("/products", async (req, res) => {
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.send(products)
        })

        // single Product
        app.get("/products/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await productsCollection.findOne(query);
            res.json(product)
        })

        // Post Api
        app.post("/products", async (req, res) => {
            const product = req.body;
            const result = await productsCollection.insertOne(product);
            res.json(result)
        })
        // delete data
        app.delete("/products/:id", async (req, res) => {
            const id = res.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.deleteOne(query);
            res.json(result)
        })
    }
    finally {
        // await client.close();
    }
}

app.get("/", (req, res) => {
    res.send("Running JUM MOTORS Server")
})

app.listen(port, () => {
    console.log("server", port)
})