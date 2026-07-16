import { createClient } from "@supabase/supabase-js";
import { getEnv, isSupabaseEnabled } from "../config/env.js";
function getAnonKey(env) {
  return env.SUPABASE_ANON_KEY || env.SUPABASE_PUBLISHABLE_KEY || "";
}
function getServiceRoleKey(env) {
  return env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET_KEY || "";
}
function createSupabaseAdmin() {
  const env = getEnv();
  const secretKey = getServiceRoleKey(env);
  if (!env.SUPABASE_URL || !secretKey) {
    console.warn("[Supabase] SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY/SUPABASE_SECRET_KEY n\xE3o configurados.");
    return null;
  }
  return createClient(env.SUPABASE_URL, secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
function createSupabaseClient() {
  const env = getEnv();
  const anonKey = getAnonKey(env);
  if (!env.SUPABASE_URL || !anonKey) {
    console.warn("[Supabase] SUPABASE_URL ou SUPABASE_ANON_KEY/SUPABASE_PUBLISHABLE_KEY n\xE3o configurados.");
    return null;
  }
  return createClient(env.SUPABASE_URL, anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
function createUserSupabaseClient(token) {
  const env = getEnv();
  const anonKey = getAnonKey(env);
  if (!env.SUPABASE_URL || !anonKey) {
    return null;
  }
  return createClient(env.SUPABASE_URL, anonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
async function createSupabaseAuthUser(email, password, userData) {
  const admin = createSupabaseAdmin();
  if (!admin) {
    throw new Error("Supabase Admin client n\xE3o dispon\xEDvel. Verifique SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.");
  }
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: userData
  });
  if (error) {
    throw error;
  }
  return data?.user;
}
async function deleteSupabaseAuthUser(email) {
  const admin = createSupabaseAdmin();
  if (!admin) return;
  const { data: users } = await admin.auth.admin.listUsers();
  const user = users?.users?.find((u) => u.email === email);
  if (user) {
    await admin.auth.admin.deleteUser(user.id);
  }
}
async function updateSupabaseAuthUser(email, userData) {
  const admin = createSupabaseAdmin();
  if (!admin) return;
  const { data: users } = await admin.auth.admin.listUsers();
  const user = users?.users?.find((u) => u.email === email);
  if (user) {
    await admin.auth.admin.updateUserById(user.id, {
      user_metadata: userData
    });
  }
}
export {
  createSupabaseAdmin,
  createSupabaseAuthUser,
  createSupabaseClient,
  createUserSupabaseClient,
  deleteSupabaseAuthUser,
  isSupabaseEnabled,
  updateSupabaseAuthUser
};
