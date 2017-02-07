var XMPP = require('node-xmpp-client');
const uuidV4 = require('uuid/v4');

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
  return xmpp_client.send(ackStanza);
}

var sendMessage = function(xmpp_client, payload) {
  var stanza = buildStanza(payload);
  return xmpp_client.send(stanza);
};

var handleStanzaResponse = function(xmpp_client, stanza) {
  if (stanza.is('message') && stanza.attrs.type !== 'error') {
    var data = JSON.parse(stanza.getChildText('gcm'));

    if (!data || !data.message_id) {
        return;
    }

    switch (data.message_type) {
        case 'control':
            if (data.control_type === 'CONNECTION_DRAINING') {
              // TODO: Handle reconnection
              xmpp_client.end(); // kill connection
            }
            break;
        case 'nack':
        case 'ack':
            if (data.message_id) {
              // TODO: Pretty print response
              console.log('Stanza: ');
              for(var key in data) {
                console.log(`${key}:`, data[key]);
              }
            }
            break;
        case 'receipt': {
            if (data.from) {
                sendAckMessage(xmpp_client, data);
            }
            break;
        }
        default: {
            // An Upstream from client: Send ack, as per spec
            if (data.from) {
                sendAckMessage(xmpp_client, data);
            }

            break;
        }
    }
  }
};

module.exports.buildStanza = buildStanza;
module.exports.buildAckStanza = buildAckStanza;
module.exports.sendMessage = sendMessage;
module.exports.handleStanzaResponse = handleStanzaResponse;
