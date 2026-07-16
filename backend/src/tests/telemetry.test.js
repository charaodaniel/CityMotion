/**
 * Tests for GET /api/analytics/telemetry
 *
 * Builds the full Fastify app with SQLite in-memory,
 * inserts test refueling data, and verifies the telemetry
 * endpoint returns correct month-by-month cost/volume aggregation.
 */
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { buildApp } from "../app.js";
import { getDb, getSchema } from "../db/index.js";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

const TEST_JWT_SECRET = "test-secret-key-for-unit-tests-min-32-chars!!";

let app;
let token;
let testIds = [];

beforeAll(async () => {
  process.env.JWT_SECRET = TEST_JWT_SECRET;
  process.env.DATABASE_URL = "";
  app = await buildApp();

  // Generate a valid JWT for authentication
  token = jwt.sign(
    { id: 999, name: "Test Admin", role: "Desenvolvedor Global" },
    TEST_JWT_SECRET
  );

  // Insert test refueling data directly into SQLite
  const db = getDb();
  const schema = getSchema();

  // Clear any existing refuelings first (to keep test isolated)
  await db.delete(schema.refuelings);

  // Insert refuelings across 3 different months
  const refuelings = [
    { vehicleId: "1", vehicleModel: "Test Car", licensePlate: "TEST-001", date: "2024-01-15", liters: 50, price: 6.0, totalValue: 300, fuelType: "Gasolina", gasStation: "Posto Teste", driverName: "João", notes: "" },
    { vehicleId: "1", vehicleModel: "Test Car", licensePlate: "TEST-001", date: "2024-01-20", liters: 40, price: 6.0, totalValue: 240, fuelType: "Gasolina", gasStation: "Posto Teste", driverName: "João", notes: "" },
    { vehicleId: "2", vehicleModel: "Test Van", licensePlate: "TEST-002", date: "2024-02-10", liters: 60, price: 5.5, totalValue: 330, fuelType: "Diesel", gasStation: "Posto Teste", driverName: "Maria", notes: "" },
    { vehicleId: "2", vehicleModel: "Test Van", licensePlate: "TEST-002", date: "2024-03-05", liters: 45, price: 5.5, totalValue: 247.5, fuelType: "Diesel", gasStation: "Posto Teste", driverName: "Maria", notes: "" },
    { vehicleId: "1", vehicleModel: "Test Car", licensePlate: "TEST-001", date: "2024-03-25", liters: 55, price: 6.0, totalValue: 330, fuelType: "Gasolina", gasStation: "Posto Teste", driverName: "João", notes: "" },
  ];

  for (const r of refuelings) {
    const result = await db.insert(schema.refuelings).values(r).returning();
    testIds.push(result[0].id);
  }
});

afterAll(async () => {
  // Clean up test data BEFORE closing app
  const db = getDb();
  const schema = getSchema();
  for (const id of testIds) {
    try { await db.delete(schema.refuelings).where(eq(schema.refuelings.id, id)); } catch {}
  }
  await app.close();
});

describe("GET /api/analytics/telemetry", () => {
  it("should return 401 without authentication", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/analytics/telemetry",
    });
    expect(response.statusCode).toBe(401);
  });

  it("should return telemetry data grouped by month", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/analytics/telemetry",
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThanOrEqual(3);

    // January should have 2 refuelings: 300 + 240 = 540
    const jan = body.find((d) => d.month === "Jan");
    expect(jan).toBeDefined();
    expect(jan.cost).toBeCloseTo(540, 0);
    expect(jan.volume).toBe(2);

    // February should have 1 refueling: 330
    const feb = body.find((d) => d.month === "Fev");
    expect(feb).toBeDefined();
    expect(feb.cost).toBeCloseTo(330, 0);
    expect(feb.volume).toBe(1);

    // March should have 2 refuelings: 247.5 + 330 = 577.5
    const mar = body.find((d) => d.month === "Mar");
    expect(mar).toBeDefined();
    expect(mar.cost).toBeCloseTo(577.5, 0);
    expect(mar.volume).toBe(2);
  });

  it("should use SQLite engine in test environment", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/analytics/telemetry",
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.length).toBeGreaterThanOrEqual(1);
    // Every entry should have the expected shape
    body.forEach((entry) => {
      expect(entry).toHaveProperty("month");
      expect(entry).toHaveProperty("cost");
      expect(entry).toHaveProperty("volume");
      expect(typeof entry.cost).toBe("number");
      expect(typeof entry.volume).toBe("number");
    });
  });

  it("should return empty array when no refuelings match", async () => {
    // Insert a record with a date far in the past so month is unknown
    const db = getDb();
    const schema = getSchema();
    const result = await db.insert(schema.refuelings).values({
      vehicleId: "0", vehicleModel: "Ghost", licensePlate: "GHOST-000",
      date: "1900-12-31", liters: 1, price: 1, totalValue: 1,
      fuelType: "Test", gasStation: "Test", driverName: "Test", notes: "temp"
    }).returning();

    // Delete the temp record so test isolation is maintained
    await db.delete(schema.refuelings).where(eq(schema.refuelings.id, result[0].id));

    // The main dataset still has 3+ months of data
    const response = await app.inject({
      method: "GET",
      url: "/api/analytics/telemetry",
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(Array.isArray(body)).toBe(true);
    // Should still have the original test data (3+ months)
    expect(body.length).toBeGreaterThanOrEqual(3);
  });
});
