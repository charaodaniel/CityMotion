CREATE TABLE "report_templates" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" text DEFAULT 'default' NOT NULL,
	"header_logo" text,
	"header_logo_secondary" text,
	"header_title" text,
	"header_subtitle" text,
	"header_extra" text,
	"primary_color" text DEFAULT '#3b82f6',
	"secondary_color" text DEFAULT '#1e293b',
	"accent_color" text DEFAULT '#10b981',
	"footer_text" text,
	"footer_extra" text,
	"sector_name" text,
	"sector_department" text,
	"updated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
