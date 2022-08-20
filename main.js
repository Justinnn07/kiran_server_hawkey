const axios = require("axios");
const data = require("./main.json");

const arr = [];

const getAllData = async () => {
  await axios.get("https://hawkeye-1.herokuapp.com/data").then((res) => {
    arr.push(res.data);
  });
  console.log(arr);
};

getAllData();

if (arr.length > 0) {
  for (let index = 0; index < arr[0].length; index++) {
    axios.delete("https://hawkeye-1.herokuapp.com/data", {
      id: arr[0][index].id,
    });
  }
}
