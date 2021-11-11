const express = require("express");
const app = express();
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
const { MongoClient } = require('mongodb');
require("dotenv").config();


// Middleware
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b9zut.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri)

async function run() {
    try {
        await client.connect();
        // console.log("database successfully connected")
        const database = client.db("JUM-MOTORS");
        const productsCollection = database.collection("products");
        const userCollection = database.collection("users");
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
            console.log("hit the api", product);
            const result = await productsCollection.insertOne(product);
            res.json(result)
        })
        // delete data
        app.delete("/products/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.deleteOne(query);
            res.json(result)
        })

        // users
        app.post("/users", async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user)
            res.json(result);
        })

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Running JUM MOTORS Server")
})

app.listen(port, () => {
    console.log("server", port)
})