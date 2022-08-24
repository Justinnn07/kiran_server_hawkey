const axios = require("axios");
const data = require("./main.json");

for (let index = 0; index < data.length; index++) {
  axios.post("http://localhost:3011/top-users", data[index]).then((res) => {
    console.log(res.data);
  });
}

console.log(data[0].trends);
