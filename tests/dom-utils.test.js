/**
 * Tests for public/js/dom-utils.js
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { loadScript, loadStylesheet } from '../public/js/dom-utils.js';

describe('loadScript', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create a script element and append to head', async () => {
    const appendChild = vi.spyOn(document.head, 'appendChild');

    // Trigger load but don't await — we need to simulate onload first
    const promise = loadScript('https://example.com/test.js');
    const script = document.querySelector('script[src="https://example.com/test.js"]');

    expect(script).not.toBeNull();
    expect(script.src).toBe('https://example.com/test.js');

    // Simulate successful load
    script.onload(new Event('load'));
    await promise;

    expect(appendChild).toHaveBeenCalledOnce();
  });

  it('should resolve immediately if script already exists', async () => {
    // Pre-add script
    const s = document.createElement('script');
    s.src = 'https://example.com/existing.js';
    document.head.appendChild(s);

    const appendChild = vi.spyOn(document.head, 'appendChild');
    await loadScript('https://example.com/existing.js');

    expect(appendChild).not.toHaveBeenCalled();
  });

  it('should reject on load error', async () => {
    const promise = loadScript('https://example.com/fail.js');
    const script = document.querySelector('script[src="https://example.com/fail.js"]');

    script.onerror(new Event('error'));

    await expect(promise).rejects.toThrow(/Falha ao carregar/);
  });
});

describe('loadStylesheet', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create a link element and append to head', async () => {
    const appendChild = vi.spyOn(document.head, 'appendChild');

    const promise = loadStylesheet('https://example.com/style.css');
    const link = document.querySelector('link[href="https://example.com/style.css"]');

    expect(link).not.toBeNull();
    expect(link.rel).toBe('stylesheet');
    expect(link.href).toBe('https://example.com/style.css');

    link.onload(new Event('load'));
    await promise;

    expect(appendChild).toHaveBeenCalledOnce();
  });

  it('should resolve immediately if link already exists', async () => {
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = 'https://example.com/existing.css';
    document.head.appendChild(l);

    const appendChild = vi.spyOn(document.head, 'appendChild');
    await loadStylesheet('https://example.com/existing.css');

    expect(appendChild).not.toHaveBeenCalled();
  });
});
