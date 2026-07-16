CREATE TABLE "audit_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"timestamp" timestamp DEFAULT now(),
	"user_identity" text,
	"action" text,
	"table_name" text,
	"details" text
);
--> statement-breakpoint
CREATE TABLE "employees" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text DEFAULT '123456' NOT NULL,
	"role" text NOT NULL,
	"sector" text,
	"status" text DEFAULT 'Disponível',
	"matricula" text,
	"phone" text,
	"cnh" text,
	"is_demo" integer DEFAULT 0,
	"supabase_user_id" text,
	"reset_token" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "employees_email_unique" UNIQUE("email"),
	CONSTRAINT "employees_matricula_unique" UNIQUE("matricula")
);
--> statement-breakpoint
CREATE TABLE "maintenance_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"vehicle_id" text NOT NULL,
	"vehicle_model" text,
	"license_plate" text,
	"requester_name" text,
	"request_date" timestamp DEFAULT now(),
	"type" text,
	"description" text,
	"status" text DEFAULT 'Pendente'
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"sender_id" text NOT NULL,
	"receiver_id" text NOT NULL,
	"content" text NOT NULL,
	"is_read" integer DEFAULT 0,
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"status" text DEFAULT 'Ativa',
	"plan" text DEFAULT 'Basic',
	"admin_email" text,
	"active_vehicles" integer DEFAULT 0,
	"active_users" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "organizations_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "refuelings" (
	"id" serial PRIMARY KEY NOT NULL,
	"vehicle_id" text NOT NULL,
	"vehicle_model" text,
	"license_plate" text,
	"date" timestamp DEFAULT now(),
	"mileage" integer,
	"liters" real,
	"price" real,
	"total_value" real,
	"fuel_type" text,
	"gas_station" text,
	"driver_name" text,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "sectors" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"organization_id" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "trips" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"driver" text NOT NULL,
	"vehicle" text NOT NULL,
	"origin" text NOT NULL,
	"destination" text NOT NULL,
	"departure_time" text NOT NULL,
	"arrival_time" text,
	"start_mileage" integer,
	"end_mileage" integer,
	"status" text DEFAULT 'Agendada',
	"category" text,
	"start_checklist" text,
	"end_checklist" text
);
--> statement-breakpoint
CREATE TABLE "vehicle_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"sector" text,
	"details" text,
	"priority" text DEFAULT 'Média',
	"requester" text,
	"status" text DEFAULT 'Pendente',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "vehicles" (
	"id" serial PRIMARY KEY NOT NULL,
	"vehicle_model" text NOT NULL,
	"license_plate" text NOT NULL,
	"sector" text NOT NULL,
	"mileage" integer DEFAULT 0,
	"status" text DEFAULT 'Disponível',
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "vehicles_license_plate_unique" UNIQUE("license_plate")
);
--> statement-breakpoint
CREATE TABLE "work_schedules" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"employee" text NOT NULL,
	"type" text,
	"status" text DEFAULT 'Agendada',
	"start_date" text,
	"end_date" text,
	"description" text
);
--> statement-breakpoint
CREATE UNIQUE INDEX "employees_email_idx" ON "employees" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "employees_matricula_idx" ON "employees" USING btree ("matricula");