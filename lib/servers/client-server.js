"use strict";

var net     = require("net"),
    Clients = require("../models/clients.js");

// Start a TCP Server
var ClientServer = net.createServer(function (socket) {

  // Identify this client
  socket.location = socket.remoteAddress + ":" + socket.remotePort;
  var id;

  // Get client id from socket
  socket.on('data', function (data) {
    var regex = /(\d*)[\s\S]/;
    id = regex.exec(data)
    
    if (id) {
      id = id[0].trim()
      // Put this new client in the list
      Clients.addClient(id, socket);
      
    } else {
      // log this error but otherwise ignore
      console.error("Client didn't send id: " + data);
    }
  });

  // error handler
  socket.on('error', function(err) {
    throw new Error("Client " + id + " socket error: " + err.message);
  });

});
 
console.log("Client server running at port 9099\n");

module.exports = ClientServer;