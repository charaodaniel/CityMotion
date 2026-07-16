import { eq } from "drizzle-orm";
import { getDb, getSchema } from "../db/index.js";
async function reportTemplateRoutes(fastify) {
  const db = getDb();
  const schema = getSchema();
  fastify.addHook("preHandler", async (request, reply) => {
    if (request.url.startsWith("/api/report-template")) {
      await fastify.authenticate(request, reply);
    }
  });
  fastify.get("/api/report-template", {
    schema: { description: "Obter template de relat\xF3rio da organiza\xE7\xE3o", tags: ["Reports"] }
  }, async (request, reply) => {
    const user = request.user;
    const orgId = user?.organizationId || "default";
    try {
      const templates = await db.select().from(schema.reportTemplates).where(eq(schema.reportTemplates.organizationId, orgId)).limit(1);
      if (templates.length > 0) {
        return templates[0];
      }
      return {
        id: null,
        organizationId: orgId,
        headerLogo: "",
        headerLogoSecondary: "",
        headerTitle: "CityMotion",
        headerSubtitle: "Gest\xE3o Inteligente de Frotas",
        headerExtra: "",
        primaryColor: "#3b82f6",
        secondaryColor: "#1e293b",
        accentColor: "#10b981",
        footerText: "CityMotion \u2014 Mobilidade, transpar\xEAncia e efici\xEAncia.",
        footerExtra: "",
        sectorName: "",
        sectorDepartment: ""
      };
    } catch (err) {
      return {
        id: null,
        organizationId: orgId,
        headerLogo: "",
        headerLogoSecondary: "",
        headerTitle: "CityMotion",
        headerSubtitle: "Gest\xE3o Inteligente de Frotas",
        headerExtra: "",
        primaryColor: "#3b82f6",
        secondaryColor: "#1e293b",
        accentColor: "#10b981",
        footerText: "CityMotion \u2014 Mobilidade, transpar\xEAncia e efici\xEAncia.",
        footerExtra: "",
        sectorName: "",
        sectorDepartment: ""
      };
    }
  });
  fastify.put("/api/report-template", {
    schema: { description: "Salvar template de relat\xF3rio", tags: ["Reports"] }
  }, async (request, reply) => {
    const user = request.user;
    const orgId = user?.organizationId || "default";
    const data = request.body;
    const allowedFields = [
      "headerLogo",
      "headerLogoSecondary",
      "headerTitle",
      "headerSubtitle",
      "headerExtra",
      "primaryColor",
      "secondaryColor",
      "accentColor",
      "footerText",
      "footerExtra",
      "sectorName",
      "sectorDepartment"
    ];
    const updateData = { updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
    for (const field of allowedFields) {
      if (data[field] !== void 0) {
        updateData[field] = data[field];
      }
    }
    try {
      const existing = await db.select().from(schema.reportTemplates).where(eq(schema.reportTemplates.organizationId, orgId)).limit(1);
      if (existing.length > 0) {
        await db.update(schema.reportTemplates).set(updateData).where(eq(schema.reportTemplates.organizationId, orgId));
      } else {
        await db.insert(schema.reportTemplates).values({ organizationId: orgId, ...updateData });
      }
      const templates = await db.select().from(schema.reportTemplates).where(eq(schema.reportTemplates.organizationId, orgId)).limit(1);
      return { success: true, template: templates[0] || updateData };
    } catch (err) {
      console.error("[ReportTemplate] Erro ao salvar:", err.message);
      return reply.status(500).send({ success: false, message: err.message });
    }
  });
  fastify.delete("/api/report-template", {
    schema: { description: "Resetar template de relat\xF3rio para o padr\xE3o", tags: ["Reports"] }
  }, async (request, reply) => {
    const user = request.user;
    const orgId = user?.organizationId || "default";
    try {
      await db.delete(schema.reportTemplates).where(eq(schema.reportTemplates.organizationId, orgId));
      return { success: true, message: "Template resetado para o padr\xE3o." };
    } catch (err) {
      return reply.status(500).send({ success: false, message: err.message });
    }
  });
}
export {
  reportTemplateRoutes
};
