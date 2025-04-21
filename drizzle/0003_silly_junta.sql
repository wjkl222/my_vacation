CREATE TYPE "public"."payment_status" AS ENUM('pending', 'waiting_for_capture', 'succeeded', 'canceled');--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
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
CREATE TABLE "payments" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"idempotency_key" varchar(255) NOT NULL,
	"yookassa_id" varchar(255) NOT NULL,
	"confirmation_url" varchar(255) NOT NULL,
	"amount" integer NOT NULL,
	"income_amount" integer,
	"status" "payment_status" DEFAULT 'pending' NOT NULL,
	"paid" boolean DEFAULT false NOT NULL,
	"booking_id" varchar(255) NOT NULL,
	CONSTRAINT "payments_idempotency_key_unique" UNIQUE("idempotency_key"),
	CONSTRAINT "payments_yookassa_id_unique" UNIQUE("yookassa_id")
);
--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_hotel_id_hotel_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotel"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_room_id_hotel_room_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."hotel_room"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE no action ON UPDATE no action;