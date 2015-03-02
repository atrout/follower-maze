"use strict";

var assert = require("assert"),
    net    = require("net"),
    EventServer = require("../lib/servers/event-server");


describe('EventServer', function(){

  var eventPort = "9090";
  var events; 
  var server;
  

  describe('should run and listen for events', function(){
    beforeEach(function(){
      server = EventServer.listen(eventPort);
      events = new net.Socket();
        
      events.connect(eventPort);
    });

    it('start and accept an event connection', function(done) {
        
        assert.equal(events.write("666|F|60|50\r\n"), true);
        done(); 
    });

    it('listens for data emitted', function(done) {
      var eventData = "666|F|60|50\r\n";
      server = EventServer.listen(eventPort);

      events = new net.Socket();
      events.connect(eventPort);

      server.on("connection", function(socket) {
        socket.on('data', function(data) {
          assert.equal(data, eventData);
          done();
        });
      });

      events.write(eventData);
    
    });

    it('processes data received', function(done) {

      done();
    });

    it('responds to an end event', function(done) {
      var oldLog = console.log;
      var lastLog;
      console.log = function () {
          lastLog = arguments;

          // then call the regular log command
          oldLog.apply(console, arguments);
      };

      events.emit("end");
      setTimeout(function() {
        assert.equal(lastLog[0], "the end.");
        done();
      }, 10);

      
    });

    it('responds to an error', function(done) {
      try {
        events.emit("error");
      } catch(err) {
        assert(err instanceof Error);
        done();
      }
    });

  });
});