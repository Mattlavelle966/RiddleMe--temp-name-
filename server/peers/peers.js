


//mapps socket ids to peer objects to allow peers to find one another
const peers = new Map();


function getPeer(socketId) {
  // If this socket does not already have a peer object, create one
  if (!peers.has(socketId)) {
    //building peer map
    peers.set(socketId, {
      transports: new Map(),
      producers: new Map(),
      consumers: new Map()
    });
  }

  // return the peer record for this socket
  return peers.get(socketId);
}

function getPeers() {
  return peers;
}

module.exports = {
  getPeer,
  getPeers
};
