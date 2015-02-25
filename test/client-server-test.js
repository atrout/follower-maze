"use strict";

var assert = require("assert"),
    net    = require("net"),
    ClientServer = require("../lib/servers/client-server");


describe('ClientServer', function(){

  var clientPort = "9099";

  var client;

  describe('should listen for client connections', function(){
    it('start and accept a client connection', function(done) {
        ClientServer.listen(clientPort);
        
        client = new net.Socket();
        client.connect(clientPort);
        assert.equal(client.write("2932\r\n"), true);
        done(); 
    });
    
  })
});