CREATE TYPE "public"."hotel_type" AS ENUM('hotel', 'apartment');--> statement-breakpoint
CREATE TYPE "public"."sights" AS ENUM('museum', 'place');--> statement-breakpoint
CREATE TABLE "hotel_room" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"hotel_id" varchar(255) NOT NULL,
	"features" text[] NOT NULL,
	"accomodation_type" varchar(255) NOT NULL,
	"price_per_night" integer NOT NULL,
	"is_featured" boolean NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hotel" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" "hotel_type" NOT NULL,
	"description" text NOT NULL,
	"rating" integer NOT NULL,
	"tags" text[] NOT NULL,
	"food" varchar(255) NOT NULL,
	"images" text[] NOT NULL,
	"is_featured" boolean NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "museums" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"image" text NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"url" text NOT NULL,
	"type" "sights" NOT NULL
);
--> statement-breakpoint
ALTER TABLE "hotel_room" ADD CONSTRAINT "hotel_room_hotel_id_hotel_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotel"("id") ON DELETE no action ON UPDATE no action;