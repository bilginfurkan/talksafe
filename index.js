const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));


require("./main")(io);

http.listen(6010, () => {
    console.log("Listening HTTP on *:6010");
});