const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();

app.use(cors());

const server = require("http").createServer(app);

const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "public"));
app.engine("html", require("ejs").renderFile);

app.set("view engine", "html");

app.use('/', (req, res) => {
  res.render('index.html');
})

let messages = [];

io.on('connection', socket => {
  console.log(`Socket conectado: ${socket.id}`)

  socket.on('sendMessage', data => {
    messages.push(data);

    socket.broadcast.emit('receivedMessage', data);
  })
})

let port_number = server.listen(process.env.PORT || 3001);

server.listen(port_number, () => {
  console.log(`Listening on port ${port_number}`);
})