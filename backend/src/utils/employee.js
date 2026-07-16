/**
 * Utilitários para manipulação de funcionários.
 */

/**
 * Remove o campo `password` de um objeto employee de forma segura.
 * Retorna um novo objeto sem a senha.
 *
 * Uso:
 *   stripPassword({ id: 1, name: 'João', password: 'hash...', ... })
 *   → { id: 1, name: 'João', ... }
 */
export function stripPassword(employee) {
  if (!employee) return employee;
  const { password, ...rest } = employee;
  return rest;
}
