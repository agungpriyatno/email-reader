import { z } from "zod";

const create = z.object({
  name: z.string().min(1).max(255),
  email: z.string().min(1).max(255).email(),
  password: z.string().min(1).max(255),
});

const update = z.object({
  name: z.string().min(1).max(255),
});

const userSchema = {
  create,
  update,
};

export default userSchema;
