const express = require("express");
const cors = require("cors");
const port = process.env.PORT;
const app = express();
app.use(cors());
app.use(express.json());
require("dotenv").config();
app.get("/", (req, res) => console.log("Hi "));

app.post("/users", (req, res) => {
  console.log(req.body);
});

// const { MongoClient } = require("mongodb");
// const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.0ghs1gs.mongodb.net/?retryWrites=true&w=majority`;

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri);

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     //  await client.connect();
//   } finally {
//     // Ensures that the client will close when you finish/error
//     //   await client.close();
//   }
// }
// //run().catch(console.dir);
app.listen(port, () => console.log("Listening on port 5000"));
