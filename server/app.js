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

// const needle = require("needle");

// app
const app = express();
// const post = util.promisify(request.post);
// const get = util.promisify(request.get);

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

// // get rules endpoint
// app.get("/api/rules", async (req, res) => {
//   if (!BEARER_TOKEN) {
//     res.status(400).send(authMessage);
//   }

//   const token = BEARER_TOKEN;
//   const requestConfig = {
//     url: rulesURL,
//     auth: {
//       bearer: token,
//     },
//     json: true,
//   };

//   try {
//     const response = await get(requestConfig);

//     if (response.statusCode !== 200) {
//       if (response.statusCode === 403) {
//         res.status(403).send(response.body);
//       } else {
//         throw new Error(response.body.error.message);
//       }
//     }

//     res.send(response);
//   } catch (e) {
//     res.send(e);
//   }
// });

// // set rules API endpoint
// app.post("/api/rules", async (req, res) => {
//   if (!BEARER_TOKEN) {
//     res.status(400).send(authMessage);
//   }

//   const token = BEARER_TOKEN;
//   const requestConfig = {
//     url: rulesURL,
//     auth: {
//       bearer: token,
//     },
//     json: req.body,
//   };

//   try {
//     const response = await post(requestConfig);

//     if (response.statusCode === 200 || response.statusCode === 201) {
//       res.send(response);
//     } else {
//       throw new Error(response);
//     }
//   } catch (e) {
//     res.send(e);
//   }
// });

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

          if (json.connection_issue) {
            socket.emit("error", json);
            reconnect(stream, socket, token);
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
  streamTweets(socket, token);
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

// // Twitter Stream
// TOKEN = process.env.TWITTER_BEARER_TOKEN;
// const rulesURL = "https://api.twitter.com/2/tweets/search/stream/rules";
// const streamURL =
//   "https://api.twitter.com/2/tweets/search/stream?tweet.field=public_metrics&expansions=author_id";

// const rules = [{ value: "NBA" }];

// // Get Twitter Stream rules
// async function getRules() {
//   const response = await needle("get", rulesURL, {
//     headers: {
//       Authorization: `Bearer ${TOKEN}`,
//     },
//   });
//   console.log(response.body);
//   return response.body;
// }

// // Set Stream Rules
// async function setRules() {
//   const data = {
//     add: rules,
//   };

//   const response = await needle("post", rulesURL, data, {
//     headers: {
//       "content-type": "application/json",
//       Authorization: `Bearer ${TOKEN}`,
//     },
//   });
//   console.log(response.body);
//   return response.body;
// }

// // Delete Stream Rules
// async function deleteRules(rules) {
//   if (!Array.isArray(rules.data)) {
//     return null;
//   }

//   const ids = rules.data.map((rule) => rule.id);

//   const data = {
//     delete: {
//       ids: ids,
//     },
//   };

//   const response = await needle("post", rulesURL, data, {
//     headers: {
//       "content-type": "application/json",
//       Authorization: `Bearer ${TOKEN}`,
//     },
//   });
//   console.log(response.body);
//   return response.body;
// }

// (async () => {
//   let currentRules;

//   try {
//     // get stream rules
//     currentRules = await getRules();

//     //delete stream rules
//     await deleteRules(currentRules);

//     //set rules based on rules array
//     await setRules();
//   } catch (error) {
//     console.log(error);
//     process.exit(1);
//   }
// })();

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
