CREATE TABLE "subscribers" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"email" varchar(255) NOT NULL
);
