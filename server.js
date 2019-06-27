const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const PlanRoutes = express.Router();
const PORT = 4000;

var Plan = require("./plan.model");

app.use(cors());
app.use(bodyParser.json());

mongoose.connect("mongodb://127.0.0.1:27017/Plan", { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once("open", function() {
  console.log("MongoDB database connection established :)");
});

PlanRoutes.route("/").get(function(req, res) {
  Plan.find(function(err, j) {
    if (err) {
      console.log("fejl", err);
    } else {
      res.json(j);
      // res.json("Hej")
    }
  });
});

PlanRoutes.route("/:id").get(function(req, res) {
  let id = req.params.id;
  Plan.findById(id, function(err, Plan) {
    res.json(Plan);
  });
});

PlanRoutes.route("/add").post(function(req, res) {
  let plan = new Plan(req.body);
  plan
    .save()
    .then(Plan => {
      res.status(200).json({ Plan: "Plan added successfully" });
    })
    .catch(err => {
      res.status(400).send("adding new Plan failed!");
    });
});

PlanRoutes.route("/update/:id").put(function(req, res) {
  Plan.findById(req.params.id, function(err, Plan) {
    if (!Plan) res.status(404).send("Data is not found");
    else Plan.title = req.body.title;
    Plan.description = req.body.description;
    Plan.start = req.body.start;
    Plan.end = req.body.end;

    Plan.save()
      .then(Plan => {
        res.json("Plan updated");
      })
      .catch(err => {
        res.status(400).send("Update not possible");
      });
  });
});

PlanRoutes.route("/delete/:id").delete(function(req, res) {
  Plan.deleteOne({ _id: req.params.id }, function(err, result) {
    if (err) {
      res.json("Der er sket en fejl: " + err);
    } else if (result.deletedCount <= 0) {
      res.json("Der blev ikke slettet nogen Plan");
    } else {
      res.json("Antal slettet Plans: " + result.deletedCount);
    }
  }).catch(function() {
    console.log("noget gik galt, evt med forbindelsen til DB");
  });
});

app.use("/Plan", PlanRoutes);

app.listen(PORT, function() {
  console.log("server is running on port: " + PORT);
});
