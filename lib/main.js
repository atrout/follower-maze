var ClientServer = require("./servers/client-server.js")
var EventServer = require("./servers/event-server.js")

var clientPort = 9099;
var eventPort = 9090;

ClientServer.listen(clientPort);
EventServer.listen(eventPort);