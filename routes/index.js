const Router = require("express").Router();
const Channel = require("../schemas/Channel.js");
const Website = require("../schemas/Websites.js");
const Ip = require("../schemas/Ip");
const TopUsers = require("../schemas/topUsers.js");
const { default: axios } = require("axios");
const http = require("http");
const domainPing = require("domain-ping");

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

Router.post("/channel", async (req, res) => {
  const timestamp = Date.now();
  if (req.body.Link !== "") {
    await domainPing(req.body.Link).then((data) => {
      const newData = new Channel({
        ip: data.ip,
        timestamp,
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
  } else {
    const newData = new Channel({
      ...req.body,
      timestamp,
      ip: "",
    });

    newData.save((err) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send({ success: true });
      }
    });
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
Router.post("/website", async (req, res) => {
  const timestamp = Date.now();
  if (req.body.Link !== "") {
    await domainPing(req.body.Link).then((data) => {
      const newData = new Website({
        ip: data.ip,
        phone: req.body.Phone.toString(),
        timestamp,
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
  } else {
    const newData = new Website({
      ip: "",
      phone: req.body.Phone.toString(),
      timestamp,
      ...req.body,
    });
    newData.save((err) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send({ success: true });
      }
    });
  }
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
  await axios
    .get("https://api.twitter.com/1.1/trends/place.json", {
      headers: {
        Authorization:
          "bearer AAAAAAAAAAAAAAAAAAAAADdsgQEAAAAADsWy5SyZSuSiHAIxtS7qiMER%2F2I%3Dsp0Hx0gxrfjguMyX3zSftmonSd8dRpEcTroJSM8nhlhHOggtT2",
      },
      params: {
        id: "23424848",
      },
    })
    .then(({ data }) => {
      res.status(200).send(data[0].trends);
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

Router.post("/top-users", async (req, res) => {
  const newData = new TopUsers(req.body);

  try {
    newData.save((err) => {
      if (err) {
        res.status(404).send({ success: false });
      } else {
        res.status(200).send({ success: true });
      }
    });
  } catch (error) {
    res.status(404).send({ success: false });
  }
});

Router.get("/top-users", async (req, res) => {
  await TopUsers.find({})
    .then((resp) => {
      res.status(200).send(resp);
    })
    .catch((err) => res.status(400).send({ success: false }));
});
module.exports = Router;
