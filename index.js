const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
require("dotenv").config();

app.get("/", (req, res) => {
  res.send("hi !server is running!!");
});

const { MongoClient, ObjectId } = require("mongodb");
const uri = process.env.SECRET_MONGOURI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri);

async function run() {
  try {
    app.post("/users", async (req, res) => {
      console.log(req.body);

      const result = await client
        .db("bloodHub")
        .collection("users")
        .insertOne(req.body);
      res.send(result);
      console.log(result);
    });

    app.get("/users", async (req, res) => {
      const result = await client
        .db("bloodHub")
        .collection("users")
        .find()
        .toArray();
      res.send(result);
    });

    app.get("/users/:email", async (req, res) => {
      let email = req.params.email;
      // console.log(email);
      const result = await client
        .db("bloodHub")
        .collection("users")
        .findOne({ email: email });
      res.send(result);
      //console.log(result);
    });

    app.put("/users/:email", (req, res) => {
      console.log(req.body);
    });

    app.post("/bloodReq", (req, res) => {
      console.log(req.body);
    });

    app.get("/users/admin/:email", async (req, res) => {
      let email = req.params.email;
      const result = await client
        .db("bloodHub")
        .collection("users")
        .findOne({ email: email });
      const isAdmin = result.role === "admin";
      res.send(isAdmin);
    });
  } finally {
  }
}
run().catch(console.dir);
app.listen(5000, () => {
  console.log("listening on port ", 5000);
});
