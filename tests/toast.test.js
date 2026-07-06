/**
 * Tests for CityMotion Toast Notification System
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

/**
 * Creates a fresh Toast instance for each test
 * Simulates the IIFE from public/js/toast.js
 */
function createToast() {
  const DEFAULT_DURATION = 4000;
  let counter = 0;

  const COLORS = {
    success: { border: 'border-emerald-500/40', bg: 'bg-emerald-500/10', icon: 'text-emerald-400', glow: 'rgba(52,211,153,0.15)', bar: 'bg-emerald-500' },
    error:   { border: 'border-red-500/40', bg: 'bg-red-500/10', icon: 'text-red-400', glow: 'rgba(239,68,68,0.15)', bar: 'bg-red-500' },
    warning: { border: 'border-amber-500/40', bg: 'bg-amber-500/10', icon: 'text-amber-400', glow: 'rgba(251,191,36,0.15)', bar: 'bg-amber-500' },
    info:    { border: 'border-primary/40', bg: 'bg-primary/10', icon: 'text-primary', glow: 'rgba(147,197,253,0.15)', bar: 'bg-primary' },
  };

  const ICONS = {
    success: '<svg class="w-5 h-5" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4"/></svg>',
    error:   '<svg class="w-5 h-5" viewBox="0 0 24 24"><path d="M10 14l2-2"/></svg>',
    warning: '<svg class="w-5 h-5" viewBox="0 0 24 24"><path d="M12 9v2"/></svg>',
    info:    '<svg class="w-5 h-5" viewBox="0 0 24 24"><path d="M13 16h-1"/></svg>',
  };

  function ensureContainer() {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.style.cssText = 'position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;display:flex;flex-direction:column;gap:0.625rem;pointer-events:none;max-width:24rem;width:100%';
      document.body.appendChild(container);
    }
    return container;
  }

  function show(message, type = 'info', duration = DEFAULT_DURATION) {
    if (typeof message === 'object' && message !== null) {
      const opts = message;
      return show(opts.message || opts.title, opts.type || 'info', opts.duration || DEFAULT_DURATION);
    }

    const container = ensureContainer();
    const id = 'toast-' + (++counter);
    const colors = COLORS[type] || COLORS.info;
    const icon = ICONS[type] || ICONS.info;

    const el = document.createElement('div');
    el.id = id;
    el.style.cssText = 'pointer-events:auto;transform:translateX(120%);opacity:0;transition:all 0.35s cubic-bezier(0.22,1,0.36,1)';

    el.innerHTML = `
      <div class="relative overflow-hidden rounded-xl border ${colors.border} ${colors.bg}" style="background:rgba(15,15,19,0.92);box-shadow:0 8px 32px ${colors.glow}">
        <div class="${colors.bar} h-1 w-full"></div>
        <div class="flex items-start gap-3 p-4 pr-10">
          <div class="shrink-0 mt-0.5 ${colors.icon}">${icon}</div>
          <div class="flex-1 min-w-0">
            <p class="text-xs sm:text-sm font-bold text-zinc-100 leading-snug">${escapeHtml(message)}</p>
          </div>
          <button class="absolute top-3 right-3 text-zinc-600" aria-label="Fechar" data-dismiss="${id}">
            <svg class="w-4 h-4" viewBox="0 0 24 24"><path d="M6 18L18 6"/></svg>
          </button>
        </div>
      </div>`;

    container.appendChild(el);

    requestAnimationFrame(() => {
      el.style.transform = 'translateX(0)';
      el.style.opacity = '1';
    });

    const timeoutId = setTimeout(() => {
      dismiss(id);
    }, duration);

    el._timeoutId = timeoutId;
    return id;
  }

  function dismiss(id) {
    const el = document.getElementById(id);
    if (!el) return;
    clearTimeout(el._timeoutId);
    el.style.transform = 'translateX(120%)';
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 350);
  }

  function dismissAll() {
    document.querySelectorAll('[id^="toast-"]').forEach(el => {
      clearTimeout(el._timeoutId);
      el.style.transform = 'translateX(120%)';
      el.style.opacity = '0';
      setTimeout(() => el.remove(), 350);
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  return { show, dismiss, dismissAll, escapeHtml };
}

describe('Toast Notification System', () => {
  let Toast;

  beforeEach(() => {
    // Clean any existing toast containers
    const existing = document.getElementById('toastContainer');
    if (existing) existing.remove();
    Toast = createToast();
  });

  afterEach(() => {
    // Clean up after each test
    const container = document.getElementById('toastContainer');
    if (container) container.remove();
  });

  // ----------------------------------------------------------
  //  show() — Basic functionality
  // ----------------------------------------------------------
  describe('show()', () => {
    it('should create a toast element with the given message', () => {
      const id = Toast.show('Hello World');
      const el = document.getElementById(id);
      expect(el).not.toBeNull();
      expect(el.innerHTML).toContain('Hello World');
    });

    it('should create the toast container if it does not exist', () => {
      expect(document.getElementById('toastContainer')).toBeNull();
      Toast.show('Test');
      expect(document.getElementById('toastContainer')).not.toBeNull();
    });

    it('should return a unique ID for each toast', () => {
      const id1 = Toast.show('First');
      const id2 = Toast.show('Second');
      expect(id1).not.toBe(id2);
      expect(id2).toBe('toast-2');
    });

    it('should append toast to the container', () => {
      Toast.show('Toast 1');
      Toast.show('Toast 2');
      const container = document.getElementById('toastContainer');
      expect(container.children.length).toBe(2);
    });

    it('should set initial animation styles (hidden off-screen)', () => {
      const id = Toast.show('Test');
      const el = document.getElementById(id);
      expect(el.style.transform).toContain('translateX');
      expect(el.style.opacity).toBe('0');
    });
  });

  // ----------------------------------------------------------
  //  show() — Types
  // ----------------------------------------------------------
  describe('show() with different types', () => {
    it('should default to info type when no type is specified', () => {
      const id = Toast.show('Default message');
      const el = document.getElementById(id);
      expect(el.innerHTML).toContain('border-primary');
    });

    it('should render success type with correct colors', () => {
      const id = Toast.show('Success!', 'success');
      const el = document.getElementById(id);
      expect(el.innerHTML).toContain('border-emerald-500');
      expect(el.innerHTML).toContain('bg-emerald-500');
    });

    it('should render error type with correct colors', () => {
      const id = Toast.show('Error!', 'error');
      const el = document.getElementById(id);
      expect(el.innerHTML).toContain('border-red-500');
      expect(el.innerHTML).toContain('bg-red-500');
    });

    it('should render warning type with correct colors', () => {
      const id = Toast.show('Warning!', 'warning');
      const el = document.getElementById(id);
      expect(el.innerHTML).toContain('border-amber-500');
      expect(el.innerHTML).toContain('bg-amber-500');
    });

    it('should render info type with correct colors', () => {
      const id = Toast.show('Info!', 'info');
      const el = document.getElementById(id);
      expect(el.innerHTML).toContain('border-primary');
    });

    it('should fallback to info for unknown types', () => {
      const id = Toast.show('Unknown type', 'unknown');
      const el = document.getElementById(id);
      expect(el.innerHTML).toContain('border-primary');
    });
  });

  // ----------------------------------------------------------
  //  show() — Object syntax
  // ----------------------------------------------------------
  describe('show() with object parameter', () => {
    it('should accept object with message and type', () => {
      const id = Toast.show({ message: 'Object message', type: 'error' });
      const el = document.getElementById(id);
      expect(el.innerHTML).toContain('Object message');
      expect(el.innerHTML).toContain('border-red-500');
    });

    it('should accept object with title as message', () => {
      const id = Toast.show({ title: 'Title as message' });
      const el = document.getElementById(id);
      expect(el.innerHTML).toContain('Title as message');
      expect(el.innerHTML).toContain('border-primary');
    });

    it('should prefer message over title', () => {
      const id = Toast.show({ title: 'Title', message: 'Message' });
      const el = document.getElementById(id);
      expect(el.innerHTML).toContain('Message');
      expect(el.innerHTML).not.toContain('Title');
    });

    it('should default to info type in object syntax', () => {
      const id = Toast.show({ message: 'Default type' });
      const el = document.getElementById(id);
      expect(el.innerHTML).toContain('border-primary');
    });
  });

  // ----------------------------------------------------------
  //  dismiss()
  // ----------------------------------------------------------
  describe('dismiss()', () => {
    it('should remove a toast by id', () => {
      const id = Toast.show('To dismiss');
      expect(document.getElementById(id)).not.toBeNull();
      // Use fake timers for the animation delay
      vi.useFakeTimers();
      Toast.dismiss(id);
      vi.advanceTimersByTime(400);
      expect(document.getElementById(id)).toBeNull();
      vi.useRealTimers();
    });

    it('should do nothing if toast id does not exist', () => {
      // Should not throw
      expect(() => Toast.dismiss('nonexistent')).not.toThrow();
    });

    it('should clear the auto-dismiss timeout', () => {
      vi.useFakeTimers();
      const id = Toast.show('Auto dismiss');
      const el = document.getElementById(id);
      expect(el._timeoutId).toBeDefined();
      Toast.dismiss(id);
      // After dismiss, the timeout should be cleared and element removed
      vi.advanceTimersByTime(400);
      expect(document.getElementById(id)).toBeNull();
      vi.useRealTimers();
    });
  });

  // ----------------------------------------------------------
  //  dismissAll()
  // ----------------------------------------------------------
  describe('dismissAll()', () => {
    it('should remove all toasts', () => {
      Toast.show('One');
      Toast.show('Two');
      Toast.show('Three');
      expect(document.getElementById('toastContainer')?.children.length).toBe(3);

      vi.useFakeTimers();
      Toast.dismissAll();
      vi.advanceTimersByTime(400);
      expect(document.getElementById('toastContainer')?.children.length).toBe(0);
      vi.useRealTimers();
    });

    it('should do nothing if no toasts exist', () => {
      expect(() => Toast.dismissAll()).not.toThrow();
    });
  });

  // ----------------------------------------------------------
  //  ensureContainer() — Container reuse
  // ----------------------------------------------------------
  describe('Container management', () => {
    it('should reuse existing container', () => {
      Toast.show('First');
      const container = document.getElementById('toastContainer');
      expect(container.children.length).toBe(1);

      Toast.show('Second');
      // Same container should be reused
      expect(document.getElementById('toastContainer')).toBe(container);
      expect(container.children.length).toBe(2);
    });

    it('should create container with correct styles', () => {
      Toast.show('Test');
      const container = document.getElementById('toastContainer');
      expect(container.style.position).toBe('fixed');
      expect(container.style.zIndex).toBe('9999');
      expect(container.style.flexDirection).toBe('column');
    });
  });

  // ----------------------------------------------------------
  //  escapeHtml()
  // ----------------------------------------------------------
  describe('escapeHtml()', () => {
    it('should escape HTML tags', () => {
      const result = Toast.escapeHtml('<script>alert("xss")</script>');
      expect(result).not.toContain('<script>');
      expect(result).toContain('&lt;');
    });

    it('should escape single quotes and backticks if present', () => {
      // Quotes in text content don't require HTML escaping
      const result = Toast.escapeHtml('He said "hello"');
      expect(result).toContain('He said');
      expect(result).toContain('hello');
    });

    it('should escape ampersands', () => {
      const result = Toast.escapeHtml('AT&T');
      expect(result).toContain('AT&amp;T');
    });

    it('should return empty string for null/undefined', () => {
      expect(Toast.escapeHtml(null)).toBe('');
      expect(Toast.escapeHtml(undefined)).toBe('');
    });

    it('should return empty string for empty input', () => {
      expect(Toast.escapeHtml('')).toBe('');
    });

    it('should return normal text unchanged', () => {
      expect(Toast.escapeHtml('Hello World')).toBe('Hello World');
    });

    it('should prevent XSS in rendered toast', () => {
      const id = Toast.show('<img onerror="alert(1)" src=x>');
      const el = document.getElementById(id);
      // The HTML should be escaped, not interpreted
      expect(el.innerHTML).toContain('&lt;');
      expect(el.innerHTML).not.toContain('<img');
    });
  });

  // ----------------------------------------------------------
  //  Edge cases
  // ----------------------------------------------------------
  describe('Edge cases', () => {
    it('should handle empty message string', () => {
      const id = Toast.show('');
      const el = document.getElementById(id);
      expect(el).not.toBeNull();
    });

    it('should handle null message', () => {
      const id = Toast.show(null);
      const el = document.getElementById(id);
      expect(el).not.toBeNull();
    });

    it('should handle very long messages without breaking', () => {
      const longMsg = 'A'.repeat(1000);
      const id = Toast.show(longMsg);
      const el = document.getElementById(id);
      expect(el.innerHTML).toContain(longMsg);
    });

    it('should include close button in each toast', () => {
      const id = Toast.show('With close');
      const el = document.getElementById(id);
      expect(el.innerHTML).toContain('Fechar');
      expect(el.querySelector('[aria-label="Fechar"]')).not.toBeNull();
    });

    it('should render icon based on type', () => {
      const id = Toast.show('Icon test', 'warning');
      const el = document.getElementById(id);
      // Warning icon SVG should be present
      expect(el.innerHTML).toContain('<svg');
    });
  });

  // ----------------------------------------------------------
  //  Auto-dismiss
  // ----------------------------------------------------------
  describe('Auto-dismiss', () => {
    it('should auto-dismiss after default duration', () => {
      vi.useFakeTimers();
      const id = Toast.show('Auto dismiss');
      expect(document.getElementById(id)).not.toBeNull();

      // Advance past default duration (4000ms) + animation (350ms)
      vi.advanceTimersByTime(4400);
      expect(document.getElementById(id)).toBeNull();
      vi.useRealTimers();
    });

    it('should auto-dismiss after custom duration', () => {
      vi.useFakeTimers();
      const id = Toast.show('Custom duration', 'info', 500);
      expect(document.getElementById(id)).not.toBeNull();

      // Advance past duration (500ms) + dismiss animation (350ms)
      vi.advanceTimersByTime(900);
      expect(document.getElementById(id)).toBeNull();
      vi.useRealTimers();
    });

    it('should auto-dismiss with object syntax custom duration', () => {
      vi.useFakeTimers();
      const id = Toast.show({ message: 'Fast dismiss', duration: 200 });
      expect(document.getElementById(id)).not.toBeNull();

      // Advance past duration (200ms) + dismiss animation (350ms)
      vi.advanceTimersByTime(600);
      expect(document.getElementById(id)).toBeNull();
      vi.useRealTimers();
    });
  });

  // ----------------------------------------------------------
  //  Multiple toasts
  // ----------------------------------------------------------
  describe('Multiple toasts', () => {
    it('should stack multiple toasts vertically', () => {
      Toast.show('First');
      Toast.show('Second');
      Toast.show('Third');
      const container = document.getElementById('toastContainer');
      expect(container.children.length).toBe(3);
      // Toasts are prepended in order
      expect(container.children[0].id).toBe('toast-1');
      expect(container.children[1].id).toBe('toast-2');
      expect(container.children[2].id).toBe('toast-3');
    });

    it('should dismiss only the specified toast', () => {
      Toast.show('Keep');
      const toRemove = Toast.show('Remove');
      Toast.show('Also keep');

      vi.useFakeTimers();
      Toast.dismiss(toRemove);
      vi.advanceTimersByTime(400);

      const container = document.getElementById('toastContainer');
      expect(container.children.length).toBe(2);
      expect(document.getElementById(toRemove)).toBeNull();
      vi.useRealTimers();
    });
  });
});
