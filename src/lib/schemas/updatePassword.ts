import { z } from "zod";

const updateIdPassword = z.object({
  password: z.string().min(1).max(255),
});

export { updateIdPassword };
