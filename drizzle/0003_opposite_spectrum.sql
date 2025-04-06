ALTER TABLE "session_to_user_mapping" DROP CONSTRAINT "session_to_user_mapping_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "session_to_user_mapping" ADD COLUMN "user_email" text NOT NULL;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "is_anyone_allowed" boolean NOT NULL;--> statement-breakpoint
ALTER TABLE "session_to_user_mapping" ADD CONSTRAINT "session_to_user_mapping_user_email_users_email_fk" FOREIGN KEY ("user_email") REFERENCES "public"."users"("email") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_to_user_mapping" DROP COLUMN "user_id";