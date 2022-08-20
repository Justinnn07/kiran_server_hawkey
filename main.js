const axios = require("axios");
axios.get("https://hawkeye-1.herokuapp.com/data").then((res) => {
  console.log(res.data);
});
