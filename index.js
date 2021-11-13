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
        const orderCollection = database.collection("orders");
        const reviewCollection = database.collection("reviews");
        // get Products
        app.get("/products", async (req, res) => {
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.json(products)
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
            // console.log("hit the api", product);
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

        //find Users email
        app.get("/users/:email", async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await userCollection.findOne(query);
            let isAdmin = false;
            if (user?.role == "admin") {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })
        // users add
        app.post("/users", async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user)
            res.json(result);
        })

        // google user
        app.put("/users", async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.json(result)
        })
        // Admin add
        app.put("/users/admin", async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: "admin" } };
            const result = await userCollection.updateOne(filter, updateDoc);
            res.json(result)
        })

        // User  check
        app.get("/users", async (req, res) => {
            const cursor = userCollection.find({});
            const usersData = await cursor.toArray();
            res.json(usersData);
        })
        // User delete data
        app.delete("/users/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            res.json(result)
        })

        // reviews add
        app.post("/reviews", async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.json(result)
        })

        // get Reviews
        app.get("/reviews", async (req, res) => {
            const cursor = reviewCollection.find({});
            const reviews = await cursor.toArray();
            res.json(reviews)
        })

        // Put Order
        app.put("/orders", async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await orderCollection.updateOne(filter, updateDoc, options);
            res.json(result)
        })
        // get single Order
        app.get("/orders", async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = orderCollection.find(query);
            const result = await cursor.toArray();
            res.json(result)
        })
        // get  Order
        app.get("/orders", async (req, res) => {
            const cursor = orderCollection.find({});
            const result = await cursor.toArray();
            res.send(result)
        })
        // order delete data
        // app.delete("/orders", async (req, res) => {
        //     const id = req.params.email;
        //     const query = { email: email };
        //     const result = await orderCollection.deleteOne(query);
        //     res.json(result)
        // })
        // order delete data
        app.delete("/orders/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.json(result)
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