import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.string(),
});

export type EnvSchema = z.infer<typeof EnvSchema>;

// eslint-disable-next-line node/prefer-global/process
export default EnvSchema.parse(process.env);
