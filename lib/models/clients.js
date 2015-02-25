"use strict";

var clients = {};

// send a message to a client
var writeToClient = function(id, message) {
  var client = clients[id];
  if (client && client.socket) 
    client.socket.write(message + "\n");
}

module.exports = {
    // add client socket to clients object
    addClient: function(id, socket) {
      clients[id] = { socket: socket };
    },

    // needed for tests?
    getClient: function(id) {
      if (clients.id) return clients.id;
      else console.log("oops. there was no client " + id);
    },

    // broadcast: notify all clients
    broadcast: function(message) {
      for (var key in clients) {
        writeToClient(key, message);
      }
    },

    // private: tell 'to' client about event
    privateMessage: function(clientId, message) {
      writeToClient(clientId, message);
    },

    // status: notify followers of this user
    notifyStatus: function(clientId, message) {
      var client = clients[clientId];

      if (client && client.followers) {
        var followers = client.followers;
        followers.forEach(function(followerId) {
          writeToClient(followerId, message);
        });
      }
    },

    // follow: tell 'to' client about follow event
    addFollower: function(clientId, followerId, message) {
      var client = clients[clientId];

      if (! client) {
        clients[clientId] = {};
        client = clients[clientId];
      }
      
      if (! client.followers) 
        client.followers = [];
      
      client.followers.push(followerId);
      
      writeToClient(clientId, message);
    },

    // unfollow: no notification
    removeFollower: function(clientId, followerId) {
      var client = clients[clientId];
      
      if (client && client.followers) {
        var followers = client.followers;
        var index = followers.indexOf(followerId);
        if (index >= 0) {
          followers.splice(index, 1);
        }
      }
    }
};