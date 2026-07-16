#!/usr/bin/env node
/**
 * CityMotion — Adiciona extensões .js nos imports relativos do backend
 * 
 * O backend usa ESM ("type": "module") e precisa de extensões .js
 * em todos os imports relativos (ex: "./config/env" → "./config/env.js").
 * 
 * Uso: node scripts/fix-backend-imports.mjs
 */

import { readFileSync, writeFileSync, globSync } from 'fs';
import { execSync } from 'child_process';

// Buscar todos os .js no backend
const files = execSync(
  'find backend/src -name "*.js" -not -path "*/node_modules/*"',
  { encoding: 'utf-8' }
).trim().split('\n').filter(Boolean);

let fixed = 0;

for (const file of files) {
  let code = readFileSync(file, 'utf-8');
  let original = code;

  // Regex: from "./path" or from './path' (relative imports sem extensão)
  // Não modifica imports de pacotes npm (sem "./" ou "../")
  code = code.replace(
    /(from\s+['"])(\.\/|\.\.\/)([^'"]+?)(['"])/g,
    (match, prefix, rel, path, suffix) => {
      // Se já tem extensão, não modificar
      if (path.endsWith('.js') || path.endsWith('.mjs') || path.endsWith('.json')) {
        return match;
      }
      return `${prefix}${rel}${path}.js${suffix}`;
    }
  );

  if (code !== original) {
    writeFileSync(file, code, 'utf-8');
    fixed++;
  }
}

console.log(`✅ ${fixed} arquivos com imports corrigidos (extensão .js adicionada).`);
