"use strict";

var assert = require("assert"),
    net    = require("net"),
    Clients = require("../lib/models/clients");

function MockClient(id) {
  this.id = id;
};

MockClient.prototype = {
  write: function(message) {
    this.message = message;
  }
}

describe('Clients Model', function(){

  describe('should allow ', function(){
    it('adding a client', function(done) {
      var client = new net.Socket();

      Clients.addClient("1", client);
      var newClient = Clients.getClient("1");
      assert(newClient.socket === client);
      Clients.removeClient("1");
      done();     
    });

    it('broadcasting a message to clients', function(done) {    
      var mc2 = new MockClient("2");
      var mc3 = new MockClient("3");
      var message = "Is anyone out there?";

      Clients.addClient("2", mc2);
      Clients.addClient("3", mc3);

      Clients.broadcast(message);

      assert(mc2.id === "2" && mc2.message === message + "\n");
      assert(mc3.id === "3" && mc3.message === message + "\n");
      done();
    });

    it('sending a private message between clients', function(done) {
      var mc2 = Clients.getClient("2").socket;
      var mc3 = Clients.getClient("3").socket;

      Clients.privateMessage("2", "Holla");

      assert(mc2.id === "2" && mc2.message === "Holla" + "\n");
      assert(mc3.id === "3" && mc3.message === "Is anyone out there?" + "\n");
      done();
    });

    it('adding a follower', function(done) {
      var mc2 = Clients.getClient("2");
      var mc3 = Clients.getClient("3").socket;
      var message = "3 is following you";
      
      // 3 is following 2
      Clients.addFollower("2", "3", message);

      assert(mc2.socket.id === "2" && mc2.socket.message === message + "\n");
      var result = [ '3' ];
      assert.deepEqual(mc2.followers, result);
      done();
    });

    it('notifying client followers of status', function(done) {
      var mc3 = Clients.getClient("3").socket;
      var status = "I'm in town!";

      Clients.notifyStatus('2', status);

      assert(mc3.message === status + "\n");

      done();
    });

    it('removing a follower', function(done) {
      var mc2 = Clients.getClient("2");

      Clients.removeFollower("2", "3");

      assert.deepEqual(mc2.followers, []);
      done();
    });

    it('not notifying status to clients that are not following', function(done) {
      var mc2 = Clients.getClient("2").socket;
      var mc3 = Clients.getClient("3").socket;
      var mc4 = new MockClient("4");
      var followMessage = "4 is following you";
      var status = "Hey everybody!";
      var mc3Message = mc3.message;

      Clients.addClient("4", mc4);
      Clients.addFollower("2", "4", followMessage);

      Clients.notifyStatus("2", status);

      // 4 is following message
      assert(mc2.message === followMessage + "\n");
      // not following 2, old message
      assert(mc3.message === mc3Message);
      // 2 status
      assert(mc4.message === status + "\n")

      done();
    });

  });
});