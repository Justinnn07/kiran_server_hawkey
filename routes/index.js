const Router = require("express").Router();
const Channel = require("../schemas/Channel.js");
const Website = require("../schemas/Websites.js");

Router.get("/", (req, res) => {
  res.status(200).send("Hello World");
});

// channel routes
Router.get("/channel", async (req, res) => {
  await Channel.find({})
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => res.status(404).send(err));
});

Router.post("/channel", (req, res) => {
  const newData = new Channel(req.body);
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

Router.delete("/channel", (req, res) => {
  const deleteData = Channel.findByIdAndDelete(req.body.id);
  try {
    deleteData.then((data) => {
      res.status(200).send(data);
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Website Routes

Router.post("/website", (req, res) => {
  const newData = new Website(req.body);
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

Router.get("/website", async (req, res) => {
  await Website.find({})
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => res.status(404).send(err));
});

module.exports = Router;
