const io = require("socket.io-client");

const connect = url => {
  let socket;
  let lastPromise = new Promise((resolve, reject) => {
    const sock = io(url);
    sock.on("connect", () => resolve(sock));
    sock.on("connect_error", err => reject(err));
  }).then(s => {
    socket = s;
    setImmediate(() => {
      lastPromise = lastPromise.finally(() => socket.destroy());
    });
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

  api.expect = (eventName, handler) => {
    api.then(
      () =>
        new Promise(resolve => {
          socket.once(eventName, (...args) => resolve(args));
        })
    );
    if (handler) {
      api.then(args => handler(...args));
    }
    return api;
  };

  api.end = handler => {
    return api.then(res => handler(null, res), err => handler(err));
  };

  return api;
};

module.exports = connect;
