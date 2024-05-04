import { z } from "zod";

const create = z.object({
  imaps: z.array(
    z.object({
      user: z.string().min(1).max(255),
      imapId: z.string().min(1).max(255),
      expiredTime: z.string().min(1).max(255),
    })
  ),
});

const update = z.object({
  expiredTime: z.string().min(1).max(255),
})

const clientImapSchema = {
  create,
  update
};

export default clientImapSchema;
