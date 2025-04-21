CREATE TYPE "public"."payment_status" AS ENUM('pending', 'waiting_for_capture', 'succeeded', 'canceled');--> statement-breakpoint
CREATE TABLE "hotel_room" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"name" varchar(255) NOT NULL,
	"image" text NOT NULL,
	"hotel_id" varchar(255) NOT NULL,
	"size" integer NOT NULL,
	"price_per_night" integer NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hotel" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"rating" numeric(3, 1) NOT NULL,
	"images" text NOT NULL,
	"medicalBase" varchar(255) NOT NULL,
	"is_featured" boolean NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hotels_to_facilities" (
	"hotel_id" varchar(255) NOT NULL,
	"facility_id" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hotels_to_treatment_indications" (
	"hotel_id" varchar(255) NOT NULL,
	"treatment_indication_id" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"phone_number" varchar(255) NOT NULL,
	"additional_info" text DEFAULT '' NOT NULL,
	"guests" integer NOT NULL,
	"hotel_id" varchar(255) NOT NULL,
	"room_id" varchar(255) NOT NULL,
	"is_active" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"role" varchar(5) DEFAULT 'user' NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "medical_bases" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "treatment_indications" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "facilities" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "hotel_room" ADD CONSTRAINT "hotel_room_hotel_id_hotel_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotel"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotel" ADD CONSTRAINT "hotel_medicalBase_medical_bases_id_fk" FOREIGN KEY ("medicalBase") REFERENCES "public"."medical_bases"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotels_to_facilities" ADD CONSTRAINT "hotels_to_facilities_hotel_id_hotel_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotel"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotels_to_facilities" ADD CONSTRAINT "hotels_to_facilities_facility_id_facilities_id_fk" FOREIGN KEY ("facility_id") REFERENCES "public"."facilities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotels_to_treatment_indications" ADD CONSTRAINT "hotels_to_treatment_indications_hotel_id_hotel_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotel"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotels_to_treatment_indications" ADD CONSTRAINT "hotels_to_treatment_indications_treatment_indication_id_treatment_indications_id_fk" FOREIGN KEY ("treatment_indication_id") REFERENCES "public"."treatment_indications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_hotel_id_hotel_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotel"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_room_id_hotel_room_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."hotel_room"("id") ON DELETE no action ON UPDATE no action;