const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const routes = require("./routes");

const app = express();
app.use(cors());

const server = require("http").Server(app);
const io = require("socket.io")(server);

io.on("connection", socket => {
  socket.on("connectRoom", box => {
    socket.join(box);
  });
});

mongoose.connect(
  process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/uploader",
  {
    useNewUrlParser: true,
    useCreateIndex: true
  }
);

app.use((req, res, next) => {
  req.io = io;
  return next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/files", express.static(path.resolve(__dirname, "..", "tmp")));

app.use(routes);

server.listen(process.env.PORT || 3003, () => {
  console.log("Server on. Port : 3003");
});
