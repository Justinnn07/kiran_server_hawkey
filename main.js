const { default: axios } = require("axios");
const data = require("./main.json");

for (let index = 0; index < data.length; index++) {
  const api = async () => {
    await axios
      .post("http://localhost:3011/channel", {
        ...data[index],
      })
      .then((res) => console.log(res.data));
  };

  api();
}
