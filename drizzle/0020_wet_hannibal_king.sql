CREATE TYPE "public"."rating_type" AS ENUM('like', 'dislike');--> statement-breakpoint
ALTER TABLE "hotel_reactions" RENAME TO "hotel_rating";--> statement-breakpoint
ALTER TABLE "hotel_rating" RENAME COLUMN "reaction" TO "type";--> statement-breakpoint
ALTER TABLE "hotel_rating" DROP CONSTRAINT "hotel_reactions_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "hotel_rating" DROP CONSTRAINT "hotel_reactions_hotel_id_hotel_id_fk";
--> statement-breakpoint
ALTER TABLE "hotel_rating" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "hotel_rating" ALTER COLUMN "user_id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "hotel_rating" ADD CONSTRAINT "hotel_rating_hotel_id_hotel_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotel"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotel_rating" ADD CONSTRAINT "hotel_rating_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;