const io = require("socket.io")();
const socketApi = {
  io: io,
};
// Add your socket.io logic here!
io.on("connection", function (socket) {
  console.log("user connect socket");
});
// // end of socket.io logic
module.exports = socketApi;
