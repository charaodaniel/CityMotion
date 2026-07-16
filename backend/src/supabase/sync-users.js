import "dotenv/config";
import { eq } from "drizzle-orm";
import { getDb, getSchema } from "../db/index.js";
import { createSupabaseAdmin, isSupabaseEnabled } from "../supabase/client.js";
const args = process.argv.slice(2);
const isDryRun = args.includes("--dry");
const emailFilter = args.find((a) => a.startsWith("--email="))?.split("=")[1];
async function syncUsers() {
  console.log("========================================");
  console.log("  Sync: Funcion\xE1rios \u2192 Supabase Auth");
  console.log("========================================\n");
  if (!isSupabaseEnabled()) {
    console.error("\u274C Supabase n\xE3o configurado. Configure SUPABASE_URL e SUPABASE_PUBLISHABLE_KEY.");
    process.exit(1);
  }
  const supabaseAdmin = createSupabaseAdmin();
  if (!supabaseAdmin) {
    console.error("\u274C Admin client n\xE3o dispon\xEDvel. Verifique SUPABASE_SERVICE_ROLE_KEY/SUPABASE_SECRET_KEY.");
    process.exit(1);
  }
  const db = getDb();
  const schema = getSchema();
  const employees = await db.select().from(schema.employees).orderBy(schema.employees.name);
  const toSync = employees.filter((e) => !e.supabaseUserId);
  console.log(`\u{1F4CA} Total de funcion\xE1rios: ${employees.length}`);
  console.log(`   \u2022 Com supabase_user_id: ${employees.filter((e) => e.supabaseUserId).length}`);
  console.log(`   \u2022 Para sincronizar:     ${toSync.length}`);
  if (emailFilter) {
    const filtered = toSync.filter((e) => e.email === emailFilter);
    console.log(`   \u2022 Filtrado por email:   ${filtered.length}`);
    if (filtered.length === 0) {
      const alreadySynced = employees.find((e) => e.email === emailFilter && e.supabaseUserId);
      if (alreadySynced) {
        console.log(`   \u26A0\uFE0F  Usu\xE1rio ${emailFilter} j\xE1 sincronizado (supabase_user_id: ${alreadySynced.supabaseUserId})`);
      }
      console.log("\n\u2705 Conclu\xEDdo.");
      return;
    }
    toSync.length = 0;
    toSync.push(...filtered);
  }
  if (toSync.length === 0) {
    console.log("\n\u2705 Nenhum funcion\xE1rio precisa de sincroniza\xE7\xE3o.");
    return;
  }
  if (isDryRun) {
    console.log("\n\u{1F50D} MODO DRY-RUN \u2014 Nenhuma a\xE7\xE3o ser\xE1 executada.\n");
    for (const emp of toSync) {
      console.log(`   [DRY] Criaria usu\xE1rio Supabase para: ${emp.name} <${emp.email}> (senha: 123456)`);
    }
    console.log(`
   Total: ${toSync.length} usu\xE1rio(s) (dry-run)`);
    return;
  }
  console.log("\n\u{1F680} Sincronizando...\n");
  let created = 0;
  let skipped = 0;
  let errors = 0;
  for (const emp of toSync) {
    const password = emp.matricula || "123456";
    try {
      const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
      const existing = existingUsers?.users?.find(
        (u) => u.email === emp.email
      );
      let supabaseUserId;
      if (existing) {
        supabaseUserId = existing.id;
        console.log(`   \u{1F517} Vinculando: ${emp.name} <${emp.email}> \u2192 ID: ${supabaseUserId}`);
      } else {
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
          email: emp.email,
          password,
          email_confirm: true,
          user_metadata: {
            name: emp.name,
            role: emp.role,
            user_local_id: String(emp.id)
          }
        });
        if (error) {
          throw error;
        }
        supabaseUserId = data?.user?.id;
        console.log(`   \u2705 Criado: ${emp.name} <${emp.email}> \u2192 ID: ${supabaseUserId}`);
      }
      if (supabaseUserId) {
        await db.update(schema.employees).set({ supabaseUserId }).where(eq(schema.employees.id, emp.id));
        created++;
      }
    } catch (err) {
      console.error(`   \u274C Erro ao sincronizar ${emp.email}: ${err.message}`);
      errors++;
    }
  }
  console.log("\n========================================");
  console.log(`  Resumo:`);
  console.log(`  \u2705 Sincronizados: ${created}`);
  console.log(`  \u23ED\uFE0F  Pulados:      ${skipped}`);
  console.log(`  \u274C Erros:        ${errors}`);
  console.log("========================================");
}
syncUsers().then(() => process.exit(0)).catch((err) => {
  console.error("Erro fatal:", err);
  process.exit(1);
});
