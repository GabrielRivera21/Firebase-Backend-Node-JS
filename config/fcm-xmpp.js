var nconf = require('nconf');
nconf.env().file({ file: __dirname + '/config.json' });
var XMPP = require('node-xmpp-client');
var fcm_utils = require('../utils/fcm-utils');

var SenderID = nconf.get('FCM_SENDER_ID');
var ServerKey = nconf.get('FCM_SERVER_KEY');

var client = new XMPP.Client({
    jid: `${SenderID}@gcm.googleapis.com` ,
    password: ServerKey,
    host: 'fcm-xmpp.googleapis.com',
    port: 5236,
    reconnect: true,
    legacySSL: true,
    preferredSaslMechanism : 'PLAIN'
});

console.log("Client built");

client.connection.socket.setTimeout(0);
client.connection.socket.setKeepAlive(true, 10000);
client.connection.socket.on('error', function (error) {
  console.error(error)
});

client.on('online', function() {
  console.log('online')
});

client.on('offline', function () {
  console.log('Client is offline')
});

client.on('disconnect', function (e) {
  console.log('Client is disconnected', client.connection.reconnect, e)
});

client.on('close', function () {
    console.log('closed');
});

client.on('stanza', function(stanza) {
  console.log('Incoming stanza: ', stanza.toString() + "\n");
  fcm_utils.handleStanzaResponse(client, stanza);
});

client.on('error', function (e) {
  console.error(e)
});

module.exports = client;
