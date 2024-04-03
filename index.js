const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
require("dotenv").config();

const { MongoClient, ObjectId } = require("mongodb");
const uri = process.env.SECRET_MONGOURI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri);

async function run() {
  try {
    app.get("/users", async (req, res) => {
      const result = await client
        .db("bloodHub")
        .collection("users")
        .find()
        .toArray();

      res.send(result);
    });

    app.post("/users", async (req, res) => {
      //   console.log(req.body);

      const result = await client
        .db("bloodHub")
        .collection("users")
        .insertOne(req.body);
      res.send(result);
      //console.log(result);
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

    app.patch("/users/updateProfile/:email", async (req, res) => {
      const collectionName = client.db("bloodHub").collection("users");
      // console.log(req.body);

      const newProfile = {
        name: req.body.name,
        available: req.body.available,
        lastDonate: req.body.lastDonate,
        location: req.body.location,
        phone: req.body.phone,
        role: req.body.role,
        status: req.body.status,
      };
      const result = await collectionName.updateOne(
        { email: req.params.email },
        {
          $set: {
            ...newProfile,
          },
        }
      );

      //console.log(result);
      res.send(result);
    });

    app.put("/users/:email/changeRole", async (req, res) => {
      const collectionName = client.db("bloodHub").collection("users");
      // console.log(req.body.updatedRole);
      const result = await collectionName.updateOne(
        { email: req.params.email },
        {
          $set: {
            role: req.body.updatedRole,
          },
        }
      );

      res.send(result);
    });
    app.put("/users/:email/changeStatus", async (req, res) => {
      const collectionName = client.db("bloodHub").collection("users");

      const result = await collectionName.updateOne(
        { email: req.params.email },
        {
          $set: {
            status: req.body.updatedStatus,
          },
        }
      );

      res.send(result);
    });

    app.get("/users/admin/:email", async (req, res) => {
      let email = req.params.email;
      const result = await client
        .db("bloodHub")
        .collection("users")
        .findOne({ email: email });
      const isAdmin = result.role && result.role == "admin" ? true : false;

      res.send(isAdmin);
    });

    app.get("/users/checkStatus/:email", async (req, res) => {
      let email = req.params.email;
      const result = await client
        .db("bloodHub")
        .collection("users")
        .findOne({ email: email });
      const isBlock = result.status && result.status === "Block" ? true : false;

      res.send(isBlock);
    });

    app.post("/users/bloodRequest", async (req, res) => {
      //  console.log(req.body);

      const result = await client
        .db("bloodHub")
        .collection("requestBlood")
        .insertOne(req.body);

      res.send(result);
    });

    app.get("/myRequests/:email", async (req, res) => {
      let email = req.params.email;
      const result = await client
        .db("bloodHub")
        .collection("requestBlood")
        .find({ requestedBy: email })
        .toArray();

      //    console.log("my request : ", result);
      res.send(result);
    });

    app.delete("/myRequest/:reqId", async (req, res) => {
      const result = await client
        .db("bloodHub")
        .collection("requestBlood")
        .deleteOne({ _id: new ObjectId(req.params.reqId) });

      console.log(result);
      res.send(result);
    });
    app.put("/myRequest/:reqId", async (req, res) => {
      console.log("new req ", req.body.status);
      const result = await client
        .db("bloodHub")
        .collection("requestBlood")
        .updateOne(
          { _id: new ObjectId(req.params.reqId) },
          {
            $set: {
              status: req.body.status,
            },
          }
        );

      console.log("edit ", result);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);
app.listen(5000, () => {
  console.log("listening on port ", 5000);
});
