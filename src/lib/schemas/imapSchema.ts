import { z } from "zod";

const create = z.object({
  user: z.string().min(1).max(255).email(),
});

const update = z.object({
  user: z.string().min(1).max(255).email(),
});

const imapSchema = {
  create,
  update,
};

export default imapSchema;
