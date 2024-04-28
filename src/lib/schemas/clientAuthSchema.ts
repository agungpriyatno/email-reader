import { z } from "zod";

const signIn = z.object({
  email: z.string().min(1).max(255).email(),
  password: z.string().min(1).max(255),
});

const clientAuthSchema = {
  signIn,
};

export default clientAuthSchema;