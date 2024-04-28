import { z } from "zod";

const create = z.object({
  name: z.string().min(1).max(255),
  email: z.string().min(1).max(255).email(),
  password: z.string().min(1).max(255),
  imaps: z.array(z.object({ imapId: z.string() })),
});

const update = z.object({
  name: z.string().min(1).max(255),
});

const clientSchema = {
  create,
  update,
};

export default clientSchema;
