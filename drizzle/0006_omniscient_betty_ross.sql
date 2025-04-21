ALTER TABLE "hotel" RENAME COLUMN "images" TO "image";--> statement-breakpoint
ALTER TABLE "hotel" ADD COLUMN "country" varchar(255) NOT NULL;