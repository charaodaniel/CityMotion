/**
 * Utilitários para verificação de permissões baseadas em role.
 *
 * Uso:
 *   hasRole(user, ['admin', 'dev'])        → true/false
 *   hasRole(user, 'root')                   → true/false (auto-wrap em array)
 */
export function hasRole(user, allowedRoles) {
  if (!user) return false;
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  const userRole = (user.role || '').toLowerCase();
  return roles.some(role => userRole.includes(role.toLowerCase()));
}

/**
 * Verifica se o usuário tem perfil de infraestrutura (dev, ti, admin, root).
 */
export function hasInfraAccess(user) {
  return hasRole(user, ['desenvolvedor', 'dev', 'root', 'ti', 'infra', 'administrador']);
}
