import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { sql } from 'drizzle-orm';
import { getDb, getSchema } from './index';

const hash = bcrypt.hashSync('123456', 10);
const rootHash = bcrypt.hashSync('123456789', 10);
const demoHash = bcrypt.hashSync('nexus2024', 10);

export async function initializeDatabase() {
  console.log('\x1b[36m[Nexus-Core]:\x1b[0m Iniciando provisionamento de banco de dados...');

  const db = getDb();
  const schema = getSchema();

  // =============================================================
  // Verificar se já existem dados — não deletar em reinicializações
  // =============================================================
  let existingCount = 0;
  try {
    const existing = await (db as any).select({ count: sql`COUNT(*)` }).from(schema.employees);
    existingCount = Number(existing[0]?.count || 0);
  } catch (e) {
    // Tables might not exist yet, that's ok
  }

  if (existingCount > 0) {
    console.log(`\x1b[33m[Seed]:\x1b[0m Banco já populado (${existingCount} registros encontrados). Pulando seed.`);
    return;
  }

  console.log('\x1b[36m[Seed]:\x1b[0m Banco vazio. Injetando dados vitais...');

  // =============================================================
  // Seed Employees (Usuários)
  // =============================================================
  const users = [
    {
      name: 'Desenvolvedor Root',
      email: 'dev@dev.com',
      password: rootHash,
      role: 'Desenvolvedor Global',
      sector: JSON.stringify(['TI - Infraestrutura']),
      matricula: 'root',
      phone: '000000000',
      is_demo: 0,
    },
    {
      name: 'Júlio César',
      email: 'admin@citymotion.com',
      password: hash,
      role: 'Administrador',
      sector: JSON.stringify(['Gabinete do Prefeito']),
      matricula: 'GP-001',
      phone: '5511999999999',
      is_demo: 0,
    },
    {
      name: 'João da Silva',
      email: 'driver@citymotion.com',
      password: hash,
      role: 'Motorista',
      sector: JSON.stringify(['Secretaria de Obras, Viação e Urbanismo']),
      matricula: 'M-001',
      phone: '5511777777777',
      is_demo: 0,
    },
    {
      name: 'Avaliador Demonstração',
      email: 'demo@citymotion.com',
      password: demoHash,
      role: 'Gestor de Setor',
      sector: JSON.stringify(['Gabinete do Prefeito']),
      matricula: 'DEMO-ROOT',
      phone: '5511000000000',
      is_demo: 1,
    },
  ];

  for (const u of users) {
    try {
      await (db as any).insert(schema.employees).values(u);
    } catch (e: any) {
      console.warn(`[Seed] Aviso ao inserir usuário ${u.email}:`, e.message);
    }
  }

  // =============================================================
  // Seed Organizations
  // =============================================================
  const orgs = [
    { id: 'ORG001', name: 'Prefeitura de CityMotion', slug: 'citymotion-gov', status: 'Ativa', plan: 'Enterprise', adminEmail: 'admin@citymotion.com', activeVehicles: 25, activeUsers: 120 },
    { id: 'ORG002', name: 'Logística TransRápido', slug: 'transrapido', status: 'Ativa', plan: 'Pro', adminEmail: 'ceo@transrapido.com.br', activeVehicles: 12, activeUsers: 45 },
    { id: 'ORG003', name: 'Saúde em Movimento', slug: 'saude-mov', status: 'Demonstração', plan: 'Basic', adminEmail: 'contato@saudemov.org', activeVehicles: 3, activeUsers: 8 },
  ];

  for (const o of orgs) {
    try {
      await (db as any).insert(schema.organizations).values(o);
    } catch (e: any) {
      console.warn(`[Seed] Aviso ao inserir org ${o.name}:`, e.message);
    }
  }

  console.log('\x1b[32m[Sucesso]:\x1b[0m Dados vitais injetados no kernel.');
}

// Executar diretamente
// Check if running directly
const isMainModule = process.argv[1] && (process.argv[1].endsWith('seed.ts') || process.argv[1].endsWith('seed.js'));
if (isMainModule) {
  initializeDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
