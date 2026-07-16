#!/usr/bin/env node
/**
 * CityMotion — Conversor TS → JS
 * 
 * Usa esbuild para remover tipos TypeScript de todos os arquivos .ts/.tsx
 * e renomeá-los para .js/.jsx.
 * 
 * Uso: node scripts/convert-to-js.mjs
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'fs';
import * as esbuild from 'esbuild';

console.log('🔧 Instalando esbuild...');
execSync('npm install --no-save esbuild 2>&1', { stdio: 'inherit', cwd: process.cwd() });

// Re-import after install
const esbuild2 = await import('esbuild');

const srcDirs = ['backend/src', 'src', 'nexusbridge'];
const skipPatterns = [
  'node_modules', '.next', 'dist', 
  'next.config.ts', 'tailwind.config.ts',
  'backend/drizzle.config.ts',
  '.d.ts'
];

// Coletar arquivos
const allFiles = [];
for (const dir of srcDirs) {
  if (!existsSync(dir)) continue;
  const result = execSync(
    `find ${dir} -type f \\( -name "*.ts" -o -name "*.tsx" \\) ${skipPatterns.map(p => `! -path "*/${p}*"`).join(' ')}`,
    { encoding: 'utf-8' }
  );
  allFiles.push(...result.trim().split('\n').filter(Boolean));
}

console.log(`📦 Encontrados ${allFiles.length} arquivos para converter.`);

let converted = 0;
let errors = [];

for (const file of allFiles) {
  try {
    const code = readFileSync(file, 'utf-8');
    const isTsx = file.endsWith('.tsx');
    
    // Usar esbuild para remover tipos
    const result = esbuild2.transformSync(code, {
      loader: isTsx ? 'tsx' : 'ts',
      format: 'esm',
      tsconfigRaw: {},
    });
    
    const outFile = file.replace(/\.tsx?$/, isTsx ? '.jsx' : '.js');
    writeFileSync(outFile, result.code, 'utf-8');
    unlinkSync(file);
    
    converted++;
    if (converted % 15 === 0 || converted === allFiles.length) {
      console.log(`✅ ${converted}/${allFiles.length} — ${outFile.replace(/^.*\//, '')}`);
    }
  } catch (err) {
    errors.push({ file, error: err.message });
    console.error(`❌ Erro em ${file}: ${err.message}`);
  }
}

console.log(`\n🎉 Conversão concluída! ${converted} arquivos convertidos.`);
if (errors.length > 0) {
  console.log(`\n⚠️  ${errors.length} erro(s):`);
  errors.forEach(({ file, error }) => console.error(`   - ${file}: ${error}`));
}

// Remover esbuild (não é dependência permanente)
execSync('npm uninstall esbuild 2>&1', { stdio: 'inherit', cwd: process.cwd() });
console.log('\n🧹 esbuild removido (não é dependência permanente).');
console.log('\n📋 Próximos passos:');
console.log('   1. Verificar se os imports do backend precisam de extensão .js');
console.log('   2. Rodar os testes');
console.log('   3. Verificar se o Next.js compila corretamente');
