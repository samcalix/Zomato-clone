const express = require("express");
const app = express();
const port = process.env.PORT || 5500;
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")

//middleware connect to frontend
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());


app.get("/", (req, res) => {
    res.send("Hello World");
});


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://samandrews2030:calix2569@cluster0.yxjvmh5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
    const ProductCollection = client.db("ZomatoDB").collection("vegmeals")

    app.post('/products', async (req , res) => {
      const data = req.body;
      const result = await ProductCollection.insertOne(data);
      res.send(result);
    });

    app.get('/allproduct', async (req , res) => {
      const vegmeals = ProductCollection.find();
      const result = await vegmeals.toArray();
      res.send(result);
    });
    app.get('/product/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await ProductCollection.findOne(filter);
      res.send(result);
    });
    app.patch('/product/:id', async (req, res) => {
      const id = req.params.id;
      
      const filter = {_id: new ObjectId(id) };
      const update = req.body;
      const updateDoc = { $set: { ...update } };
      const option = { upsert: true };
      const result = await ProductCollection.updateOne(
        filter,
        updateDoc,
        option
      );
      res.send(result);
    });
    app.delete('/product/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await ProductCollection.deleteOne(filter);
      res
       .status(200)
       .json({ success: true, message: "data deleted succesfully",  result });
    });


    //nvegmeals

    const ProductCollection1 = client.db("ZomatoDB").collection("nvegmeals")

    app.post('/nproducts', async (req , res) => {
      const data = req.body;
      const result = await ProductCollection1.insertOne(data);
      res.send(result);
    });

    app.get('/nallproduct', async (req , res) => {
      const nvegmeals = ProductCollection1.find();
      const result = await nvegmeals.toArray();
      res.send(result);
    });
    app.get('/nproduct/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await ProductCollection1.findOne(filter);
      res.send(result);
    });
    app.patch('/nproduct/:id', async (req, res) => {
      const id = req.params.id;
      
      const filter = {_id: new ObjectId(id) };
      const update = req.body;
      const updateDoc = { $set: { ...update } };
      const option = { upsert: true };
      const result = await ProductCollection1.updateOne(
        filter,
        updateDoc,
        option
      );
      res.send(result);
    });
    app.delete('/nproduct/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await ProductCollection1.deleteOne(filter);
      res
       .status(200)
       .json({ success: true, message: "data deleted succesfully",  result });
    });

     app.post('/nproducts', async (req , res) => {
      const data = req.body;
      const result = await ProductCollection1.insertOne(data);
      res.send(result);
    });

    app.get('/nallproduct', async (req , res) => {
      const vegmeals = ProductCollection1.find();
      const result = await vegmeals.toArray();
      res.send(result);
    });
    app.get('/nproduct/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await ProductCollection1.findOne(filter);
      res.send(result);
    });
    app.patch('/nproduct/:id', async (req, res) => {
      const id = req.params.id;
      
      const filter = {_id: new ObjectId(id) };
      const update = req.body;
      const updateDoc = { $set: { ...update } };
      const option = { upsert: true };
      const result = await ProductCollection1.updateOne(
        filter,
        updateDoc,
        option
      );
      res.send(result);
    });
    app.delete('/nproduct/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await ProductCollection1.deleteOne(filter);
      res
       .status(200)
       .json({ success: true, message: "data deleted succesfully",  result });
    });

    //Authentication

    const users = []

    const secretkey = "your-secret-key";

    app.post("/register", async (req, res) => {
      const { email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      users.push({email, password: hashedPassword });
      res.status(201).json({ message: "user registered succesfully"});
    });
    app.post("/login", async(req, res) => {
      try {
        const { email, password} = req.body;
        const user = users.find((user) => user.email === email);
        if (user) {
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (isPasswordValid) {
            const token = jwt.sign({email}, secretkey, { expiresIn: "1h" });
            res.json({ token });
          } else {
            res.status(400).json({ message: "invalid email or password" });
          }
        } else {
          res.status(400).json({ message: "invalid email or password" });
        }
      } catch (error) {
        res.status(500).send(error.message);
      }
    });
 

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`connect to mongodb ${port}`);
})
