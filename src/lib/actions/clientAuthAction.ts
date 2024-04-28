"use server";

import { ApiError } from "next/dist/server/api-utils";
import { cookies } from "next/headers";
import { z } from "zod";
import bcrypt from "../bcrypt";
import clientRepo from "../repositories/clientRepo";
import clientAuthSchema from "../schemas/clientAuthSchema";
import clientSchema from "../schemas/clientSchema";
import { decrypt, encrypt } from "../session";

const signInSchema = clientAuthSchema.signIn;
const signUpSchema = clientSchema.create;

const clientSignIn = async (payload: z.infer<typeof signInSchema>) => {
  const { success } = signInSchema.safeParse(payload);
  if (!success) throw new ApiError(405, "BAD_REQUEST");
  const data = await clientRepo.find(payload.email);
  if (!data) throw new ApiError(401, "UNAUTHORIZED");
  const match = await bcrypt.compare(payload.password, data.hash);
  if (!match) throw new ApiError(401, "UNAUTHORIZED");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const accessToken = await encrypt({ id: data.id });
  cookies().set("session", accessToken, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });

  return { data: { accessToken, expiresAt } };
};

const clientSignUp = async (payload: z.infer<typeof signUpSchema>) => {
  const { success } = signUpSchema.safeParse(payload);
  if (!success) throw new ApiError(405, "BAD_REQUEST");
  const { password, imaps, ...others } = payload;
  const hash = await bcrypt.hash(password, 10);
  await clientRepo.create({
    ...others,
    hash,
    isActive: false,
  });
};

const clientSession = async (token?: string) => {
  const payload = await decrypt(token);
  if (!payload) throw new ApiError(401, "UNAUTHORIZED");
  const { id } = payload;
  const data = await clientRepo.find(id as string);
  if (!data) throw new ApiError(401, "UNAUTHORIZED");
  return { data };
};

export { clientSession, clientSignIn, clientSignUp };

