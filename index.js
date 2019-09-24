const io = require("socket.io-client");

const connect = url => {
  let socket;
  let lastPromise = new Promise((resolve, reject) => {
    const sock = io(url);
    sock.on("connect", () => resolve(sock));
    sock.on("connect_error", err => reject(err));
  }).then(s => {
    socket = s;
  });

  const api = {};

  api.then = (onFulfilled, onRejected) => {
    lastPromise = lastPromise.then(onFulfilled, onRejected);
    return api;
  };

  api.catch = onRejected => {
    lastPromise = lastPromise.catch(onRejected);
    return api;
  };

  api.emit = (eventName, ...args) => {
    return api.then(() => socket.emit(eventName, ...args));
  };

  api.expect = eventName => {
    return api.then(
      () =>
        new Promise(resolve => {
          socket.once(eventName, (...args) => resolve(args));
        })
    );
  };

  api.end = handler => {
    return api.then(res => handler(null, res), err => handler(err));
  };

  return api;
};

module.exports = connect;
