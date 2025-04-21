CREATE TABLE "hotel_reactions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"user_id" text NOT NULL,
	"hotel_id" varchar(255) NOT NULL,
	"reaction" varchar NOT NULL
);
--> statement-breakpoint
ALTER TABLE "hotel" ADD COLUMN "likes_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "hotel" ADD COLUMN "dislikes_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "hotel_reactions" ADD CONSTRAINT "hotel_reactions_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotel_reactions" ADD CONSTRAINT "hotel_reactions_hotel_id_hotel_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotel"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscribers" ADD CONSTRAINT "subscribers_email_unique" UNIQUE("email");