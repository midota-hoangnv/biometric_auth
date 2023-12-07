const express = require("express");
const bodyParser = require("body-parser");
const SimpleWebAuthnServer = require("@simplewebauthn/server");
const rpId = "localhost";
const expectedOrigin = "http://localhost:3005";
const app = express();
var cors = require("cors");

app.use(cors());

const db = {
  users: [
    {
      id: 1,
      name: "user test",
      username: "admin",
      password: "admin",
    },
  ],
};
const session = {};
let challenges = [];

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

function getNewChallenge() {
  return Uint8Array.from("randomStringFromServer", (c) => c.charCodeAt(0));
}

function convertChallenge(challenge) {
  return challenge;
}

async function checkLogin(req, res, next) {
  let username = req.headers.authorization;
  if (!username || !session[username]) {
    return res.status(401).send({
      message: "User not authentication",
    });
  }
  next();
}

app.post("/login", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  if (!username && !password) {
    return res.status(400).send({
      message: "Please fill full information",
    });
  }
  const foundUser = db.users.find(
    (user) => user.username === username && user.password === password
  );
  if (!foundUser) {
    return res.status(400).send({
      message: "Username or password is incorrect",
    });
  }
  session[username] = true;
  return res.json({
    success: true,
  });
});

app.delete("/logout", (req, res) => {
  let username = req.headers.authorization;
  if (!username || !session[username]) {
    return res.status(400).send({
      message: "User is not logged in",
    });
  }
  delete session[username];
  return res.json({
    success: true,
  });
});

app.post("/register/start", checkLogin, (req, res) => {
  let username = req.body.username;
  let challenge = getNewChallenge();
  challenges[username] = convertChallenge(challenge);
  const pubKey = {
    challenge: 'YWFh',
    rp: { id: rpId, name: "webauthn-app" },
    user: { id: "YWFh", name: "YWFh", displayName: "YWFh" },
    pubKeyCredParams: [
      { type: "public-key", alg: -7 },
      { type: "public-key", alg: -257 },
    ],
    authenticatorSelection: {
      authenticatorAttachment: "platform",
      userVerification: "required",
      residentKey: "preferred",
      requireResidentKey: false,
    },
  };
  res.json(pubKey);
});
app.post("/register/finish", async (req, res) => {
  const username = req.body.username;
  // Verify the attestation response
  let verification;
  try {
    verification = await SimpleWebAuthnServer.verifyRegistrationResponse({
      response: req.body.data,
      expectedChallenge: challenges[username],
      expectedOrigin,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).send({ error: error.message });
  }
  const { verified, registrationInfo } = verification;
  if (verified) {
    users[username] = getRegistrationInfo(registrationInfo);
    return res.status(200).send(true);
  }
  res.status(500).send(false);
});
app.post("/login/start", (req, res) => {
  let username = req.body.username;
  if (!users[username]) {
    res.status(404).send(false);
  }
  let challenge = getNewChallenge();
  challenges[username] = convertChallenge(challenge);
  res.json({
    challenge,
    rpId,
    allowCredentials: [
      {
        type: "public-key",
        id: users[username].credentialID,
        transports: ["internal"],
      },
    ],
    userVerification: "discouraged",
  });
});

app.post("/login/finish", async (req, res) => {
  let username = req.body.username;
  if (!users[username]) {
    res.status(404).send(false);
  }
  let verification;
  try {
    const user = users[username];
    verification = await SimpleWebAuthnServer.verifyAuthenticationResponse({
      expectedChallenge: challenges[username],
      response: req.body.data,
      authenticator: getSavedAuthenticatorData(user),
      expectedRPID: rpId,
      expectedOrigin,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).send({ error: error.message });
  }

  const { verified } = verification;
  if (verified) {
    return res.status(200).send(true);
  }
  return res.status(400).send(false);
});

app.listen(3005, () => {
  console.log("Server is listening on port 3005");
});
