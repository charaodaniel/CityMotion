import { createUserSupabaseClient, createSupabaseClient, isSupabaseEnabled } from "./client.js";
function getRlsClient(request) {
  if (!isSupabaseEnabled()) return null;
  const token = request.supabaseToken;
  if (!token) return null;
  return createUserSupabaseClient(token);
}
function getPublicClient() {
  if (!isSupabaseEnabled()) return null;
  return createSupabaseClient();
}
function hasRlsContext(request) {
  return isSupabaseEnabled() && !!request.supabaseToken;
}
async function withRlsFallback(request, supabaseQuery, drizzleQuery) {
  const supabase = getRlsClient(request);
  if (supabase) {
    try {
      return await supabaseQuery(supabase);
    } catch (err) {
      console.warn("[RLS] Supabase query falhou, caindo para Drizzle:", err.message);
      return drizzleQuery();
    }
  }
  return drizzleQuery();
}
export {
  getPublicClient,
  getRlsClient,
  hasRlsContext,
  withRlsFallback
};
