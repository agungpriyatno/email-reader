"use server";

import { ApiError } from "next/dist/server/api-utils";
import { cookies } from "next/headers";
import { z } from "zod";
import bcrypt from "../bcrypt";
import userRepo from "../repositories/userRepo";
import userAuthSchema from "../schemas/userAuthSchema";
import { decrypt, encrypt } from "../session";
import userSchema from "../schemas/userSchema";

const signInSchema = userAuthSchema.signIn;
const signUpSchema = userSchema.create;

const userSignIn = async (payload: z.infer<typeof signInSchema>) => {
  const { success } = signInSchema.safeParse(payload);
  if (!success) throw new ApiError(405, "BAD_REQUEST");
  const data = await userRepo.find(payload.email);
  if (!data) throw new ApiError(401, "UNAUTHORIZED");
  const match = await bcrypt.compare(payload.password, data.hash);
  if (!match) throw new ApiError(401, "UNAUTHORIZED");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const accessToken = await encrypt({ id: data.id });
  cookies().set("client_session", accessToken, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
  return { data: { accessToken, expiresAt } };
};

const userSignUp = async (payload: z.infer<typeof signUpSchema>) => {
  const { success } = signUpSchema.safeParse(payload);
  if (!success) throw new ApiError(405, "BAD_REQUEST");
  const { password, ...others } = payload;
  const hash = await bcrypt.hash(password, 10);
  await userRepo.create({ ...others, hash });
};

const userSession = async (token?: string) => {
  const payload = await decrypt(token);
  if (!payload) throw new ApiError(401, "UNAUTHORIZED");
  const { id } = payload;
  const data = userRepo.find(id as string);
  if (!data) throw new ApiError(401, "UNAUTHORIZED");
  return { data };
};

export { userSignIn, userSignUp, userSession };
