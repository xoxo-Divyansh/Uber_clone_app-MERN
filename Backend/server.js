const http = require("node:http");
const app = require("./app.js");
const port = process.env.PORT || 3000;

const server = http.createServer(app);




server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

