require("dotenv").config();
const fs = require("fs");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoutes = require("./routes/user");
const { createServer } = require("node:http");
const { Server } = require("socket.io");

const port = 8080;
const app = express();

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(socket.id);

  socket.on("drag", (data) => {
    io.emit("drag", data);
  });

  socket.on("type", (data) => {
    io.emit("type", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("database connected"));

app.use(cors());
app.use(bodyParser.json());

app.use("/user", userRoutes);

app.get("/", (req, res) => {
  res.send("Server is up and running");
});

server.listen(port, () => {
  console.log(`server running at port ${port}`);
});
