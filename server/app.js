// import modules
const express = require("express");
const { json, urlencoded } = express;
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const http = require("http");
const request = require("request");
const path = require("path");
const socketIo = require("socket.io");
const util = require("util");
require("request").debug = true;
const post = util.promisify(request.post);
const get = util.promisify(request.get);

// const needle = require("needle");

// app
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// socket server
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;

let timeout = 0;

// setting Twitter API endpoints
const streamURL = new URL(
  "https://api.twitter.com/2/tweets/search/stream?tweet.fields=public_metrics&expansions=author_id"
);

const rulesURL = new URL(
  "https://api.twitter.com/2/tweets/search/stream/rules"
);

// setting error messages
const errorMessage = {
  title: "Please Wait",
  detail: "Waiting for new Tweets to be posted...",
};

const authMessage = {
  title: "Could not authenticate",
  details: [
    `Please make sure your bearer token is correct.
      If using Glitch, remix this app and add it to the .env file`,
  ],
  type: "https://developer.twitter.com/en/docs/authentication",
};

const sleep = async (delay) => {
  return new Promise((resolve) => setTimeout(() => resolve(true), delay));
};

// stream tweets api
const streamTweets = (socket, token) => {
  let stream;

  const config = {
    url: streamURL,
    auth: {
      bearer: token,
    },
    timeout: 31000,
  };

  try {
    const stream = request.get(config);

    stream
      .on("data", (data) => {
        try {
          const json = JSON.parse(data);

          if (json.connection_issue && !json.data) {
            console.log(json);
            socket.emit("error", json);
            console.log("GOT PAST EMIT");
            reconnect(stream, socket, token);
            console.log("reconnected!!!");
          } else {
            if (json.data) {
              socket.emit("tweet", json);
            } else {
              socket.emit("authError", json);
            }
          }
        } catch (e) {
          socket.emit("heartbeat");
        }
      })
      .on("error", (error) => {
        // Connection timed out
        console.log("ERROR HAPPENEDDDDDDDDDD!!!!!!!!!!!!!");
        reconnect(stream, socket, token);
      });
  } catch (e) {
    socket.emit("authError", authMessage);
  }
};

// reconnect function
const reconnect = async (stream, socket, token) => {
  timeout++;
  stream.abort();
  await sleep(2 ** timeout * 1000);
  stream.resume();
};

// socket connection
io.on("connection", async (socket) => {
  try {
    const token = BEARER_TOKEN;
    const stream = streamTweets(io, token);
  } catch (e) {
    io.emit("authError", authMessage);
  }
});

// db
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log("DB Connection Error", err));

// middleware
app.use(morgan("dev"));
app.use(cors({ origin: true, credentials: true }));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressValidator());

// routes
const testRoutes = require("./routes/test");
app.use("/", testRoutes);
const userRoutes = require("./routes/user");
app.use("/", userRoutes);
const twitterRoutes = require("./routes/twitter");
app.use("/", twitterRoutes);

// port
const port = process.env.PORT || 8080;

// listener
server.listen(port, () => console.log(`Server is running on port ${port}`));
