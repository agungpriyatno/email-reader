import { oauth2Client, SCOPES } from "@/lib/oauth";
import { NextResponse } from "next/server";

const GET = () => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    redirect_uri: process.env.OAUTH_REDIRECT
  });

  return NextResponse.redirect(url);
};

export { GET };
