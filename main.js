const axios = require("axios");
const data = require("./main.json");
axios.post("http://localhost:3011/website", data[index]).then((res) => {
  console.log(res.data);
});
