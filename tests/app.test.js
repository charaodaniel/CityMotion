/**
 * Tests for CityMotion App Router
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

const createApp = () => {
  const routes = {
    '/dashboard': { title: 'Painel de Controle', roles: ['dev', 'ti', 'admin', 'manager', 'employee'] },
    '/viagens': { title: 'Missões', roles: ['dev', 'ti', 'admin', 'manager', 'employee'] },
    '/veiculos': { title: 'Frota', roles: ['dev', 'ti', 'admin', 'manager'] },
    '/funcionarios': { title: 'Funcionários', roles: ['dev', 'ti', 'admin', 'manager'] },
    '/setores': { title: 'Setores', roles: ['dev', 'ti', 'admin'] },
    '/abastecimento': { title: 'Abastecimento', roles: ['dev', 'ti', 'admin', 'manager'] },
    '/manutencao': { title: 'Manutenção', roles: ['dev', 'ti', 'admin', 'manager'] },
    '/escalas': { title: 'Escalas', roles: ['dev', 'ti', 'admin', 'manager'] },
    '/chat': { title: 'Chat', roles: ['dev', 'ti', 'admin', 'manager', 'employee'] },
    '/relatorios': { title: 'Relatórios', roles: ['dev', 'ti', 'admin', 'manager'] },
    '/perfil': { title: 'Perfil', roles: ['dev', 'ti', 'admin', 'manager', 'employee'] },
    '/settings': { title: 'Configurações', roles: ['dev', 'ti', 'admin'] },
  };

  const descriptions = {
    '/dashboard': 'Visão geral da frota e operações.',
    '/viagens': 'Monitoramento de tráfego e logística operacional.',
    '/veiculos': 'Gestão da frota e telemetria dos ativos.',
    '/funcionarios': 'Controle de acesso e identificação NexusOS.',
    '/setores': 'Departamentos e alocação de recursos.',
    '/abastecimento': 'Histórico de consumo e abastecimentos.',
    '/manutencao': 'Gestão técnica e operacional de reparos.',
    '/escalas': 'Agenda de trabalho e plantões da equipe.',
    '/chat': 'Comunicação interna entre colaboradores.',
    '/relatorios': 'Exportação de dados operacionais.',
    '/perfil': 'Suas informações e histórico.',
    '/settings': 'Configurações do sistema.',
  };

  return {
    routes,
    getDescription(route) { return descriptions[route] || ''; },
    hasAccess(route, userRole) {
      const r = this.routes[route];
      return r ? r.roles.includes(userRole) : false;
    },
  };
};

describe('App Router', () => {
  let App;

  beforeEach(() => {
    App = createApp();
  });

  describe('Routes', () => {
    it('should define all 12 routes', () => {
      expect(Object.keys(App.routes)).toHaveLength(12);
    });

    it('should have correct titles', () => {
      expect(App.routes['/dashboard'].title).toBe('Painel de Controle');
      expect(App.routes['/viagens'].title).toBe('Missões');
      expect(App.routes['/veiculos'].title).toBe('Frota');
      expect(App.routes['/funcionarios'].title).toBe('Funcionários');
      expect(App.routes['/setores'].title).toBe('Setores');
      expect(App.routes['/abastecimento'].title).toBe('Abastecimento');
      expect(App.routes['/manutencao'].title).toBe('Manutenção');
      expect(App.routes['/escalas'].title).toBe('Escalas');
      expect(App.routes['/chat'].title).toBe('Chat');
      expect(App.routes['/relatorios'].title).toBe('Relatórios');
      expect(App.routes['/perfil'].title).toBe('Perfil');
      expect(App.routes['/settings'].title).toBe('Configurações');
    });

    it('should allow dev and ti access to all routes', () => {
      Object.entries(App.routes).forEach(([route, config]) => {
        expect(config.roles).toContain('dev');
        expect(config.roles).toContain('ti');
      });
    });

    it('should restrict /settings and /setores from employees', () => {
      expect(App.routes['/settings'].roles).not.toContain('employee');
      expect(App.routes['/setores'].roles).not.toContain('employee');
      expect(App.routes['/setores'].roles).not.toContain('manager');
    });

    it('should allow employee access to dashboard, viagens, chat, perfil', () => {
      expect(App.routes['/dashboard'].roles).toContain('employee');
      expect(App.routes['/viagens'].roles).toContain('employee');
      expect(App.routes['/chat'].roles).toContain('employee');
      expect(App.routes['/perfil'].roles).toContain('employee');
    });
  });

  describe('Access Control', () => {
    it('should allow access for authorized roles', () => {
      expect(App.hasAccess('/settings', 'admin')).toBe(true);
      expect(App.hasAccess('/settings', 'dev')).toBe(true);
      expect(App.hasAccess('/viagens', 'employee')).toBe(true);
    });

    it('should deny access for unauthorized roles', () => {
      expect(App.hasAccess('/settings', 'employee')).toBe(false);
      expect(App.hasAccess('/setores', 'employee')).toBe(false);
      expect(App.hasAccess('/veiculos', 'employee')).toBe(false);
    });

    it('should deny access for unknown routes', () => {
      expect(App.hasAccess('/unknown', 'admin')).toBe(false);
    });
  });

  describe('getDescription', () => {
    it('should return description for each route', () => {
      expect(App.getDescription('/dashboard')).toBe('Visão geral da frota e operações.');
      expect(App.getDescription('/viagens')).toBe('Monitoramento de tráfego e logística operacional.');
      expect(App.getDescription('/veiculos')).toBe('Gestão da frota e telemetria dos ativos.');
      expect(App.getDescription('/settings')).toBe('Configurações do sistema.');
    });

    it('should return empty string for unknown routes', () => {
      expect(App.getDescription('/unknown')).toBe('');
    });
  });

  describe('Sidebar Navigation', () => {
    it('should have routes for all navigation items', () => {
      const expectedRoutes = [
        '/dashboard', '/viagens', '/veiculos',
        '/funcionarios', '/setores',
        '/abastecimento', '/manutencao', '/escalas', '/chat',
        '/relatorios', '/perfil', '/settings',
      ];
      expectedRoutes.forEach(route => {
        expect(App.routes[route]).toBeDefined();
      });
    });
  });
});
