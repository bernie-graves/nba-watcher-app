const util = require("util");
const request = require("request");
const post = util.promisify(request.post);
const get = util.promisify(request.get);

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

// const sleep = async (delay) => {
//   return new Promise((resolve) => setTimeout(() => resolve(true), delay));
// };

// get rules endpoint
exports.getRules = async (req, res) => {
  if (!BEARER_TOKEN) {
    res.status(400).send(authMessage);
  }

  const token = BEARER_TOKEN;
  const requestConfig = {
    url: rulesURL,
    auth: {
      bearer: token,
    },
    json: true,
  };

  try {
    const response = await get(requestConfig);

    if (response.statusCode !== 200) {
      if (response.statusCode === 403) {
        res.status(403).send(response.body);
      } else {
        throw new Error(response.body.error.message);
      }
    }

    res.send(response);
  } catch (e) {
    res.send(e);
  }
};

// set rules API endpoint
exports.setRules = async (req, res) => {
  if (!BEARER_TOKEN) {
    res.status(400).send(authMessage);
  }

  const token = BEARER_TOKEN;
  const requestConfig = {
    url: rulesURL,
    auth: {
      bearer: token,
    },
    json: req.body,
  };

  try {
    const response = await post(requestConfig);

    if (response.statusCode === 200 || response.statusCode === 201) {
      res.send(response);
    } else {
      throw new Error(response);
    }
  } catch (e) {
    res.send(e);
  }
};
