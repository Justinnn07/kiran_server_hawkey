const Router = require("express").Router();
const Model = require("../schemas/index.js");

Router.get("/", (req, res) => {
  res.status(200).send("Hello World");
});

Router.get("/data", async (req, res) => {
  await Model.find({})
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => res.status(404).send(err));
});

Router.post("/data", (req, res) => {
  const newData = new Model(req.body);
  try {
    newData.save((err) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send({ success: true });
      }
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = Router;
