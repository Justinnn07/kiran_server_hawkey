const Router = require("express").Router();
const Channel = require("../schemas/Channel.js");
const Website = require("../schemas/Websites.js");
const domainPing = require("domain-ping");
const { default: axios } = require("axios");

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
  domainPing(req.body.Link.replace("https://", "")).then((data) => {
    const newData = new Channel({
      ip: data.ip,
      ...req.body,
    });

    newData.save((err) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send({ success: true });
      }
    });
  });
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
  domainPing(req.body.Link.replace(".com/", "").replace(".in/", "")).then(
    (data) => {
      const newData = new Website({ ip: data.ip, ...req.body });
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
    }
  );
});

Router.get("/website", async (req, res) => {
  await Website.find({})
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => res.status(404).send(err));
});

// twitter routes

Router.get("/twitter/data", async (req, res) => {
  axios
    .get("https://api.twitter.com/1.1/trends/place.json?id=23424848", {
      headers: {
        Authorization:
          "bearer AAAAAAAAAAAAAAAAAAAAABXZgAEAAAAAugs5n8ZUv9psUerhTi1r8UK03Ro%3DX240P1R17DihhKGsiv4Qe0IjjSQSrB4L7ShGDn8OhCTg1gPqQx",
      },
      params: {
        id: "23424848",
      },
    })
    .then(({ data }) => {
      res.status(200).send(data[0].trends);
    });
});
module.exports = Router;
