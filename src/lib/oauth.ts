import { Token } from "@prisma/client";
import { google } from "googleapis";

const SCOPES = [
  "https://mail.google.com/",
  "https://www.googleapis.com/auth/gmail.addons.current.message.action",
  "https://www.googleapis.com/auth/gmail.addons.current.message.metadata",
  "https://www.googleapis.com/auth/gmail.addons.current.message.readonly",
  "https://www.googleapis.com/auth/gmail.modify",
  "https://www.googleapis.com/auth/gmail.readonly",
];

const oauth2Client = new google.auth.OAuth2({
  clientId: process.env.OAUTH_KEY,
  clientSecret: process.env.OAUTH_SECRET,
  redirectUri: "http://localhost:3000/api/connect",
});

const oauth2SetCredential = (token: Token) => {
  const { accessToken, refreshToken, scope, expiryDate, tokenType } = token;
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
    expiry_date: expiryDate.getTime(),
    token_type: tokenType,
    scope,
  });
  return oauth2Client;
};

export { SCOPES, oauth2Client, oauth2SetCredential };
