/**
 * Unit tests for GET /api/analytics/telemetry
 *
 * Uses vi.mock() to mock the database and config layers,
 * allowing controlled test scenarios without a real database.
 *
 * The drizzle query chain is mocked at the module level:
 *   db.select().from().groupBy().orderBy() → Promise
 *
 * The route handler captures `db` and `schema` during buildApp(),
 * so mocking getDb() AFTER buildApp() has no effect.
 * Instead, we control the query result via mockDbResult.value
 * and a shouldReject flag inside the mock chain itself.
 */
import { vi, describe, it, expect, beforeAll, afterAll } from "vitest";
import jwt from "jsonwebtoken";

// ── Mock state (shared via vi.hoisted, mutable between tests) ──
const mockDbResult = vi.hoisted(() => ({ value: [], shouldReject: false }));
const mockIsPostgres = vi.hoisted(() => ({ value: false }));

// ── Mock database module ───────────────────────────────────
// The mock chain returns a Promise (drizzle queries are thenable).
// We use mockDbResult.value for data and mockDbResult.shouldReject for errors.
vi.mock("../db/index.js", () => ({
  getDb: () => ({
    select: () => ({
      from: () => ({
        groupBy: () => ({
          orderBy: () =>
            mockDbResult.shouldReject
              ? Promise.reject(new Error("Simulated database error"))
              : Promise.resolve(mockDbResult.value),
        }),
      }),
    }),
  }),
  getSchema: () => ({ refuelings: {} }),
  pgSchema: {},
  sqliteSchema: {},
}));

// ── Mock config module ─────────────────────────────────────
// Override isPostgresEnabled to use mockIsPostgres.value
vi.mock("../config/env.js", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    isPostgresEnabled: () => mockIsPostgres.value,
  };
});

// ── Imports after mocks ────────────────────────────────────
import { buildApp } from "../app.js";

const TEST_JWT_SECRET = "test-secret-key-for-unit-tests-min-32-chars!!";
let app;
let token;

beforeAll(async () => {
  process.env.JWT_SECRET = TEST_JWT_SECRET;
  // DATABASE_URL is irrelevant because config/env is mocked,
  // but we keep it empty for safety
  process.env.DATABASE_URL = "";
  app = await buildApp();
  token = jwt.sign(
    { id: 999, name: "Test Admin", role: "Desenvolvedor Global" },
    TEST_JWT_SECRET
  );
});

afterAll(async () => {
  await app.close();
});

describe("GET /api/analytics/telemetry", () => {
  // ── Reset mock state before each test ──────────────────
  beforeEach(() => {
    mockDbResult.value = [];
    mockDbResult.shouldReject = false;
    mockIsPostgres.value = false;
  });

  // ── Auth ─────────────────────────────────────────────────
  it("should return 401 without authentication", async () => {
    const res = await app.inject({ method: "GET", url: "/api/analytics/telemetry" });
    expect(res.statusCode).toBe(401);
  });

  // ── Empty database ──────────────────────────────────────
  it("should return empty array when database returns no data", async () => {
    mockDbResult.value = [];

    const res = await app.inject({
      method: "GET",
      url: "/api/analytics/telemetry",
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toEqual([]);
  });

  // ── Real data (SQLite path) ────────────────────────────
  it("should return telemetry grouped by month with correct cost/volume", async () => {
    mockDbResult.value = [
      { month: "01", totalSpent: "540", count: "2" },
      { month: "02", totalSpent: "330", count: "1" },
      { month: "03", totalSpent: "577.5", count: "2" },
    ];
    mockIsPostgres.value = false;

    const res = await app.inject({
      method: "GET",
      url: "/api/analytics/telemetry",
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body).toHaveLength(3);

    expect(body[0]).toEqual({ month: "Jan", cost: 540, volume: 2 });
    expect(body[1]).toEqual({ month: "Fev", cost: 330, volume: 1 });
    expect(body[2]).toEqual({ month: "Mar", cost: 577.5, volume: 2 });
  });

  // ── Real data (PostgreSQL path) ─────────────────────────
  it("should work correctly with PostgreSQL engine (EXTRACT path)", async () => {
    mockDbResult.value = [
      { month: "01", totalSpent: "540", count: "2" },
      { month: "02", totalSpent: "330", count: "1" },
    ];
    mockIsPostgres.value = true;

    const res = await app.inject({
      method: "GET",
      url: "/api/analytics/telemetry",
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body).toHaveLength(2);
    expect(body[0]).toEqual({ month: "Jan", cost: 540, volume: 2 });
    expect(body[1]).toEqual({ month: "Fev", cost: 330, volume: 1 });
  });

  // ── Database error ──────────────────────────────────────
  it("should return empty array when database query throws", async () => {
    mockDbResult.shouldReject = true;

    const res = await app.inject({
      method: "GET",
      url: "/api/analytics/telemetry",
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toEqual([]);
  });

  // ── null/undefined totalSpent ────────────────────────────
  it("should default cost to 0 when totalSpent is null", async () => {
    mockDbResult.value = [{ month: "06", totalSpent: null, count: "3" }];

    const res = await app.inject({
      method: "GET",
      url: "/api/analytics/telemetry",
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body[0].cost).toBe(0);
    expect(body[0].volume).toBe(3);
    expect(body[0].month).toBe("Jun");
  });

  // ── Invalid month number ────────────────────────────────
  it("should return '???' for out-of-range month", async () => {
    mockDbResult.value = [{ month: "13", totalSpent: "100", count: "1" }];

    const res = await app.inject({
      method: "GET",
      url: "/api/analytics/telemetry",
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body[0].month).toBe("???");
  });
});
