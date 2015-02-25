"use strict";

var net     = require("net"),
    Clients = require("../models/clients.js");

// Start a TCP Server
var EventServer = net.createServer(function (socket) {

  socket.setEncoding('utf8'); 
  
  // Handle incoming events.
  socket.on('data', function (data) {
    processDataChunk(data);
  });

  // splits chunks of data into messages
  // sorts messages
  // splits message to determine message type
  // process each message according to type
  function processDataChunk(data) {
    var lines = data.split('\n');
    lines.sort(compareEventIds).forEach(function(message) {
      var parts = message.split('|');

      // switch on type
      switch(parts[1]) {
        case "F":
          // add 'from' client to 'to' client list
          Clients.addFollower(parts[3], parts[2], message);
          break;
        case "U": 
          // no notification
          // remove 'from' client from 'to' client list
          Clients.removeFollower(parts[3], parts[2])
          break;
        case "B":
          Clients.broadcast(message);
          break;
        case "P":
          Clients.privateMessage(parts[3], message);
          break;
        case "S":
          // notify followers of 'from' client
          Clients.notifyStatus(parts[2], message);
          break;
        default: 
          break;
      }

    });
  };

  // comparator for messages -- sorts based on sequence #
  function compareEventIds(a, b) {
    return a.split('|')[0] - b.split('|')[0];
  };

  // socket receives end event from client
  socket.on('end', function() {
    console.log("the end.");
  });

  // error handler
  socket.on('error', function(err) {
    console.log("Event socket error: " + err.message);
  });
 
});

console.log("Event server running at port 9090\n");

module.exports = EventServer;