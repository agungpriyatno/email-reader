import { NextResponse } from "next/server";
import { google } from "googleapis";

const GET = async () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: "./secret.json",
    scopes: [
      "https://mail.google.com/",
      "https://www.googleapis.com/auth/gmail.modify",
      "https://www.googleapis.com/auth/gmail.compose",
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/gmail.metadata",
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/gmail.settings.basic",
      "https://www.googleapis.com/auth/gmail.settings.sharing",
    ],
  });

  const client = await auth.getClient();
  const admin = google.admin({ version: "datatransfer_v1", auth });

  const gmail = google.gmail({ version: "v1", auth: auth });
  try {
    const data = await gmail.users.messages.list({
      userId: "107090160246514806893",
      maxResults: 20,
    });
    //   const profile = await gmail.users.getProfile({userId: ""})
    console.log(data);

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json(error);
  }
};

export { GET };
