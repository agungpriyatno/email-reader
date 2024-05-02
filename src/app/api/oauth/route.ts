import { oauth2Client, SCOPES } from "@/lib/oauth";
import { NextResponse } from "next/server";

const GET = () => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });

  return NextResponse.redirect(url);
};

export { GET };
