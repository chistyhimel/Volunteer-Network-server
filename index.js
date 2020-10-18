const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectID;
const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-shard-00-00.7ntnx.mongodb.net:27017,cluster0-shard-00-01.7ntnx.mongodb.net:27017,cluster0-shard-00-02.7ntnx.mongodb.net:27017/${process.env.DB_NAME}?ssl=true&replicaSet=atlas-87jhz3-shard-0&authSource=admin&retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Hello World");
});

client.connect((err) => {
  const collection = client
    .db(process.env.DB_NAME)
    .collection(process.env.DB_COLLECTION);
  app.post("/volunteerRegister", (req, res) => {
    const volunteerRegister = req.body;
    collection.insertOne(volunteerRegister).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/regesteredVoluntary", (req, res) => {
    const email = req.query.email;
    collection.find({ email: email }).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get("/regesteredVolunteer", (req, res) => {
    collection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.delete("/delete/:id", (req, res) => {
    const id = req.params.id;
    collection.deleteOne({ _id: ObjectId(id) }).then((result) => {
      res.send(result.deletedCount > 0);
    });
  });
});

app.listen(process.env.PORT || 5000);
