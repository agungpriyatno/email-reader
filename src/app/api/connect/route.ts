import db from "@/lib/db";
import { oauth2Client } from "@/lib/oauth";
import { NextRequest, NextResponse } from "next/server";

const GET = async (req: NextRequest) => {
  const code = req.nextUrl.searchParams.get("code");
  const { tokens } = await oauth2Client.getToken(code ?? "");
  const { access_token, refresh_token, expiry_date, scope, token_type } =
    tokens;
  const found = await db.token.findUnique({ where: { id: "main-token" } });
  console.log(tokens);
  if (found) {
    await db.token.update({
      where: { id: "main-token" },
      data: {
        accessToken: access_token ?? "",
        refreshToken: refresh_token ?? found.refreshToken,
        tokenType: token_type ?? "",
        expiryDate: new Date(expiry_date ?? 0),
        scope: scope ?? "",
      },
    });
  } else {
    await db.token.create({
      data: {
        id: "main-token",
        accessToken: access_token ?? "",
        refreshToken: refresh_token ?? "",
        tokenType: token_type ?? "",
        expiryDate: new Date(expiry_date ?? 0),
        scope: scope ?? "",
      },
    });
  }

  const url = new URL("/api/result", req.url);

  return NextResponse.redirect(url);
};

export { GET };
