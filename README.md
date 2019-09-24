# Sukka

🧦 WebSocket testing made easy

## Setup

Install Sukka and add it to your `package.json` file:

```bash
yarn add sukka --dev
```

## Usage

Example WebSocket test using Jest:

```js
const connect = require("sukka");

test("Login replies with a welcome message", () => {
  return connect("http://localhost:3000")
    .emit("login", "Foo")
    .expect("welcome", res => expect(res).toEqual("Bar"));
});
```

This test will:

1. Attempt to connect a WebSocket to `localhost:3000`.
2. Emit a single message with _"login"_ as event name and `"Foo"` as the payload
   data.
3. Wait for a message to be received with _"welcome"_ as event name.
4. Assert that the received message contains `"Bar"` as the payload data.

## API

### .emit(eventName[, ...args])

Emits an event to the endpoint with the provided name and arguments.

### .expect(eventName[, handler])

Waits for a single event with the provided name. If a handler is provided, it
will be called with the payload from the received message.

### .end(callback)

Calls `callback` with an error as the first argument if some expectation failed.
Use this to complete the test case and report the result back to your testing
framework (typically done by passing the `done` handler as the callback).
