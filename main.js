const { default: axios } = require("axios");
const data = require("./main.json");

for (let index = 0; index < data.length; index++) {
  const api = async () => {
    await axios
      .post("http://localhost:3011/website", { ...data[0] })
      .then((res) => console.log(res.data));
  };

  api();
}
