"use strict";

var assert = require("assert"),
    net    = require("net"),
    EventServer = require("../lib/servers/event-server");


describe('EventServer', function(){

  var eventPort = "9090";
  
  // client socket
  var events; 

  // EventServer: net.Server
  var server;
  var tempListener;
  

  describe('should run and listen for events', function(){
    beforeEach(function(){
      server = EventServer.listen(eventPort);
      events = new net.Socket();
        
      events.connect(eventPort);
    });

    afterEach(function(done) {
      events.destroy();
      server.close(function(err) {
        done(err);
      });
    });

    it('start and accept an event connection', function(done) {
        
        assert.equal(events.write("666|F|60|50\r\n"), true);
        done(); 
    });

    it('listens for data emitted', function(done) {
      var eventData = "666|F|60|50\r\n";

      tempListener = function(socket) {
        socket.on('data', function(data) {
          assert.equal(data, eventData);
          done();
        });
      }

      server.on("connection", tempListener);

      events.write(eventData);
    
    });

    it('processes data received', function(done) {
      var eventData = "666|F|60|50\n" +
                   "1|U|12|9\n" +
                   "542532|B\n" + 
                   "43|P|32|56\n" + 
                   "634|S|32\r\n";
      var followReceived = false,
          unfollowReceived = false,
          privateReceived = false,
          broadcastReceived = false,
          statusReceived = false;

      server.removeListener('connection', tempListener);
      
      tempListener = function(socket) {
        socket.on('data', function(data) {
          // how do I test for each of these things?
          done();
        });
      };

      server.on("connection", tempListener);

      events.write(eventData);
      
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