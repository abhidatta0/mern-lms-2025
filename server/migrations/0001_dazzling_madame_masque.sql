CREATE TABLE "category" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	CONSTRAINT "category_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "course_levels" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	CONSTRAINT "course_levels_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "primary_languages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	CONSTRAINT "primary_languages_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "courses" RENAME COLUMN "price" TO "pricing";--> statement-breakpoint
ALTER TABLE "courses" ALTER COLUMN "is_published" SET DEFAULT true;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "welcome_message" text NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "objectives" text NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "image" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "image_public_id" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "category_id" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "primary_language_id" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "course_level_id" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_category_id_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_primary_language_id_primary_languages_id_fk" FOREIGN KEY ("primary_language_id") REFERENCES "public"."primary_languages"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_course_level_id_course_levels_id_fk" FOREIGN KEY ("course_level_id") REFERENCES "public"."course_levels"("id") ON DELETE set null ON UPDATE no action;