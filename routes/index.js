const Router = require("express").Router();
const Channel = require("../schemas/Channel.js");
const Website = require("../schemas/Websites.js");
const Ip = require("../schemas/Ip");
const { default: axios } = require("axios");
const http = require("http");
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

Router.get("/data", async (req, res) => {
  await Website.find({})
    .then((website) => {
      Channel.find({})
        .then((channel) => {
          res.status(200).send({ website, channel });
        })
        .catch((err) => res.status(404).send(err));
    })
    .catch((err) => res.status(404).send(err));
});

// twitter routes

Router.get("/twitter/data", async (req, res) => {
  axios
    .get("https://api.twitter.com/1.1/trends/place.json?id=23424848", {
      headers: {
        Authorization:
          "bearer AAAAAAAAAAAAAAAAAAAAABXZgAEAAAAAQj2ifxxrJgCMvHbDajwCZOQUmxc%3DWdN0Uj0ygPFuVNCk6ICm0hHpKqCjhsvo1JkeJ83Sn0HTdCqzWj",
      },
      params: {
        id: "23424848",
      },
    })
    .then(({ data }) => {
      res.status(200).send(data.slice(0, 4));
    });
});

Router.get("/twitter/users", async (req, res) => {
  axios
    .get("https://api.twitter.com/1.1/users/search.json?q=news", {
      headers: {
        Authorization:
          "bearer AAAAAAAAAAAAAAAAAAAAABXZgAEAAAAAQj2ifxxrJgCMvHbDajwCZOQUmxc%3DWdN0Uj0ygPFuVNCk6ICm0hHpKqCjhsvo1JkeJ83Sn0HTdCqzWj",
      },
    })
    .then(({ data }) => {
      res.status(200).send(data);
    });
});
Router.post("/ip", async (req, res) => {
  http.get({ host: req.body.ip }, function (resp) {
    const fixedData = new Ip({
      code: resp.statusCode,
      alive: resp.statusCode === 200 || 401 || 403 ? true : false,
      ip: req.body.ip,
    });

    try {
      fixedData.save((err) => {
        if (err) {
          res.status(400).send(err);
        } else {
          if (res.statusCode == 200) {
            res.send("This site is up and running!");
          } else {
            res("This site might be down " + res.statusCode);
          }
        }
      });
    } catch (error) {}
  });
});
module.exports = Router;
