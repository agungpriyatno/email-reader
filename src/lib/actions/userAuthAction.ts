"use server";

import { ApiError } from "next/dist/server/api-utils";
import { cookies } from "next/headers";
import { z } from "zod";
import bcrypt from "../bcrypt";
import userRepo from "../repositories/userRepo";
import userAuthSchema from "../schemas/userAuthSchema";
import { decrypt, encrypt } from "../session";
import userSchema from "../schemas/userSchema";
import clientAuthSchema from "../schemas/clientAuthSchema";
import db from "../db";
import { updateIdPassword } from "../schemas/updatePassword";

const signInSchema = userAuthSchema.signIn;
const signUpSchema = userSchema.create;

const updatePassword = clientAuthSchema.updatePassword;

const userUpdatePassword = async (
  token: string,
  payload: z.infer<typeof updatePassword>
) => {
  const { data } = await userSession(token);
  const user = await db.user.findUnique({ where: { id: data.id } });
  if (!user) throw new ApiError(405, "BADREQUEST");
  const match = await bcrypt.compare(payload.old, user.hash);
  if (!match) throw new ApiError(405, "BADREQUEST");
  const hash = await bcrypt.hash(payload.new, 10);
  await db.user.update({ where: { id: data.id }, data: { hash } });
};

const userIdUpdatePassword = async (
  id: string,
  payload: z.infer<typeof updateIdPassword>
) => {
  const hash = await bcrypt.hash(payload.password, 10);
  await db.user.update({ where: { id: id }, data: { hash } });
};

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
  const data = await userRepo.find(id as string);
  if (!data) throw new ApiError(401, "UNAUTHORIZED");
  return { data };
};

export { userSignIn, userSignUp, userSession, userUpdatePassword, userIdUpdatePassword };
