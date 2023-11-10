const express = require("express")();
const http = require("http").Server(express);
const fs = require("fs");
const socketio = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});

const file = "files/items.json";
const tokenFile = "files/tokens.json";

let items = [];

let tokens = [];

socketio.on("connection", (socket) => {
    socket.on("fetch", () => {
      fs.readFile(file, 'utf-8', (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        items = JSON.parse(data);
        socketio.emit("itemlist", items);
      });
    });

    socket.on("add", (n, c, p) => {
      var item = { name: n, count: c, price: p };
      items.push(item);
      var data = JSON.stringify(items);
      fs.writeFile(file, data, 'utf-8', err => {
        if (err) {
          console.error(err);
          return;
        }
      });
    });

    socket.on("get_token", () => {
        var token = crypto.randomUUID();
        tokens.push(token);
    });
  });
  
http.listen(3000, () => {
  console.log("Server up and running...");
});