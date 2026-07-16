import { z } from "zod";
const envSchema = z.object({
  PORT: z.coerce.number().default(3001),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  DATABASE_URL: z.string().optional().default(""),
  CORS_ORIGIN: z.string().default("http://localhost:9002"),
  DEMO_MODE: z.string().default("false"),
  SMTP_HOST: z.string().optional().default(""),
  SMTP_PORT: z.coerce.number().optional().default(587),
  SMTP_SECURE: z.string().optional().default("false"),
  SMTP_USER: z.string().optional().default(""),
  SMTP_PASS: z.string().optional().default(""),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  // ── Supabase ──────────────────────────────────────────────
  // Suporta ambas as nomenclaturas:
  //   @supabase/supabase-js:    SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY
  //   @supabase/server:          SUPABASE_PUBLISHABLE_KEY / SUPABASE_SECRET_KEY
  SUPABASE_URL: z.string().optional().default(""),
  SUPABASE_ANON_KEY: z.string().optional().default(""),
  SUPABASE_PUBLISHABLE_KEY: z.string().optional().default(""),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional().default(""),
  SUPABASE_SECRET_KEY: z.string().optional().default(""),
  SUPABASE_JWKS_URL: z.string().optional().default("")
});
let _env = null;
function getEnv() {
  if (!_env) {
    _env = envSchema.parse(process.env);
  }
  return _env;
}
function isPostgresEnabled() {
  return !!getEnv().DATABASE_URL;
}
function isSupabaseEnabled() {
  const env = getEnv();
  return !!env.SUPABASE_URL && (!!env.SUPABASE_ANON_KEY || !!env.SUPABASE_PUBLISHABLE_KEY);
}
export {
  envSchema,
  getEnv,
  isPostgresEnabled,
  isSupabaseEnabled
};
