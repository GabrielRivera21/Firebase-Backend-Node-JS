var nconf = require('nconf');
var XMPP = require('node-xmpp-client');

const uuidV4 = require('uuid/v4');

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

var isConnectionDraining = false;

var buildStanza = function(payload) {
  var uid = uuidV4();
  payload.message_id = `m-${uid}`;
  var stanza = new XMPP.Stanza('message', {id: payload.message_id})
        .c('gcm', {'xmlns': 'google:mobile:data'})
        .t(JSON.stringify(payload));

  return stanza;
};

var buildAckStanza = function(payload) {
  var stanza = new XMPP.Stanza('message', {id: payload.message_id})
        .c('gcm', {'xmlns': 'google:mobile:data'})
        .t(JSON.stringify({
          to: payload.from,
          message_id: payload.message_id,
          message_type: "ack"
        }));
  return stanza;
};

var sendAckMessage = function(xmpp_client, payload) {
  var ackStanza = buildAckStanza(payload);
  xmpp_client.send(ackStanza);
  return true;
}

var sendMessage = function(payload, xmpp_client) {
  if(!xmpp_client) {
    xmpp_client = this; // verify if it was sent from the main export
  }
  if(!(xmpp_client instanceof XMPP.Client)) {
    return false;
  }
  if(!isConnectionDraining) {
    var stanza = buildStanza(payload);
    xmpp_client.send(stanza);
    return true;
  }
  return false;
};

var printJSONStanzaData = function(data) {
  console.log('[START Stanza]: ');
  for(var key in data) {
    console.log(`${key}:`, data[key]);
  }
  console.log('[END Stanza]');
}

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

client.on('error', function (e) {
  console.error(e)
});

client.on('stanza', function(stanza) {
  // print raw stanza
  console.log('Incoming stanza: ', stanza.toString() + "\n");

  if (stanza.is('message') && stanza.attrs.type !== 'error') {
    var data = JSON.parse(stanza.getChildText('gcm'));

    if (!data || !data.message_id) {
        return;
    }

    printJSONStanzaData(data);

    switch (data.message_type) {
        case 'control':
            if (data.control_type === 'CONNECTION_DRAINING') {
              isConnectionDraining = true;
              // TODO: Open another connection while this one closes.
            }
            break;
        case 'nack': // TODO: Take action depending on response code for nack
        case 'ack':
            // just print it out for dev purposes
            // we can mark the notification as successfully sent on our side.
            if (data.message_id) {
              // TODO: ignore it or do something, this means CCS received
              // successfully the message.
            }
            break;
        case 'receipt':
        default: {
            // An Upstream from client or receipt: Send ack, as per spec
            if (data.from) {
                sendAckMessage(client, data);
            }
            break;
        }
    }
  }
});

module.exports = client;
module.exports.sendMessage = sendMessage;
