CREATE TYPE "public"."publication_status" AS ENUM('draft', 'published', 'archived', 'hidden');--> statement-breakpoint
CREATE TYPE "public"."source_status" AS ENUM('verified', 'needs_verification', 'estimated', 'placeholder', 'mock', 'unknown');--> statement-breakpoint
CREATE TYPE "public"."tier_list_type" AS ENUM('official', 'user', 'event', 'draft');--> statement-breakpoint
CREATE TYPE "public"."visibility_status" AS ENUM('private', 'unlisted', 'public');--> statement-breakpoint
CREATE TABLE "arc_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"external_id" text NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"icon_key" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"source_status" "source_status" DEFAULT 'unknown' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "arc_types_external_id_unique" UNIQUE("external_id"),
	CONSTRAINT "arc_types_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "elements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"external_id" text NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"color" text,
	"icon_key" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"source_status" "source_status" DEFAULT 'unknown' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "elements_external_id_unique" UNIQUE("external_id"),
	CONSTRAINT "elements_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "rarities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"external_id" text NOT NULL,
	"name" text NOT NULL,
	"rank_label" text,
	"color" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"source_status" "source_status" DEFAULT 'unknown' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "rarities_external_id_unique" UNIQUE("external_id")
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"external_id" text NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"aliases" text[] DEFAULT '{}' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"source_status" "source_status" DEFAULT 'unknown' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "roles_external_id_unique" UNIQUE("external_id"),
	CONSTRAINT "roles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "stats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"external_id" text NOT NULL,
	"name" text NOT NULL,
	"display_name" text,
	"category" text NOT NULL,
	"value_type" text NOT NULL,
	"icon_key" text,
	"allowed_as_main_stat" boolean DEFAULT false NOT NULL,
	"allowed_as_sub_stat" boolean DEFAULT false NOT NULL,
	"allowed_as_weapon_sub_stat" boolean DEFAULT false NOT NULL,
	"allowed_as_character_stat" boolean DEFAULT true NOT NULL,
	"aliases" text[] DEFAULT '{}' NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"source_status" "source_status" DEFAULT 'unknown' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "stats_external_id_unique" UNIQUE("external_id")
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"external_id" text NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"aliases" text[] DEFAULT '{}' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"source_status" "source_status" DEFAULT 'unknown' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tags_external_id_unique" UNIQUE("external_id"),
	CONSTRAINT "tags_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "media_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"external_id" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_external_id" text NOT NULL,
	"resolved_entity_external_id" text NOT NULL,
	"kind" text NOT NULL,
	"path" text NOT NULL,
	"alt" text,
	"source_url" text,
	"license_note" text,
	"width" integer,
	"height" integer,
	"source_status" "source_status" DEFAULT 'unknown' NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "media_assets_external_id_unique" UNIQUE("external_id")
);
--> statement-breakpoint
CREATE TABLE "admin_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"admin_user_id" uuid,
	"entity_type" text NOT NULL,
	"entity_id" uuid,
	"entity_external_id" text,
	"action" text NOT NULL,
	"before_json" jsonb,
	"after_json" jsonb,
	"ip_address" "inet",
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth_roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"external_id" text NOT NULL,
	"name" text NOT NULL,
	"permissions" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "auth_roles_external_id_unique" UNIQUE("external_id")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"session_token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sessions_session_token_hash_unique" UNIQUE("session_token_hash")
);
--> statement-breakpoint
CREATE TABLE "user_roles" (
	"user_id" uuid NOT NULL,
	"auth_role_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_roles_user_id_auth_role_id_pk" PRIMARY KEY("user_id","auth_role_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"external_id" text,
	"email" text,
	"display_name" text,
	"avatar_media_id" uuid,
	"status" "publication_status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_external_id_unique" UNIQUE("external_id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "character_materials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"character_id" uuid NOT NULL,
	"material_id" uuid,
	"material_name" text,
	"context" text NOT NULL,
	"level" integer,
	"amount" integer,
	"source_status" "source_status" DEFAULT 'unknown' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "character_roles" (
	"character_id" uuid NOT NULL,
	"role_id" uuid NOT NULL,
	"source_status" "source_status" DEFAULT 'unknown' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "character_roles_character_id_role_id_pk" PRIMARY KEY("character_id","role_id")
);
--> statement-breakpoint
CREATE TABLE "character_skills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"external_id" text,
	"character_id" uuid NOT NULL,
	"name" text NOT NULL,
	"skill_type" text NOT NULL,
	"description" text,
	"max_level" integer,
	"effect_json" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"source_status" "source_status" DEFAULT 'unknown' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "character_stats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"character_id" uuid NOT NULL,
	"stat_id" uuid NOT NULL,
	"level" integer,
	"value" numeric,
	"value_text" text,
	"source_status" "source_status" DEFAULT 'unknown' NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "character_tags" (
	"character_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	"source_status" "source_status" DEFAULT 'unknown' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "character_tags_character_id_tag_id_pk" PRIMARY KEY("character_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "character_voice_actors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"character_id" uuid NOT NULL,
	"locale" text NOT NULL,
	"actor_name" text NOT NULL,
	"source_url" text,
	"source_status" "source_status" DEFAULT 'unknown' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "characters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"external_id" text NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"rarity_id" uuid,
	"element_id" uuid,
	"arc_type_id" uuid,
	"faction" text,
	"birthday" text,
	"esper_ability" text,
	"profile_text" text,
	"description" text,
	"quote" text,
	"source_status" "source_status" DEFAULT 'unknown' NOT NULL,
	"publication_status" "publication_status" DEFAULT 'draft' NOT NULL,
	"raw" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "characters_external_id_unique" UNIQUE("external_id"),
	CONSTRAINT "characters_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "materials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"external_id" text NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"rarity_id" uuid,
	"category" text,
	"source_text" text,
	"media_asset_id" uuid,
	"source_status" "source_status" DEFAULT 'unknown' NOT NULL,
	"raw" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "materials_external_id_unique" UNIQUE("external_id"),
	CONSTRAINT "materials_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "weapon_growth_stats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"weapon_id" uuid NOT NULL,
	"level" integer NOT NULL,
	"stat_id" uuid NOT NULL,
	"value" numeric NOT NULL,
	"source_status" "source_status" DEFAULT 'unknown' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "weapon_recommended_characters" (
	"weapon_id" uuid NOT NULL,
	"character_id" uuid NOT NULL,
	"priority" integer DEFAULT 0 NOT NULL,
	"note" text,
	"source_status" "source_status" DEFAULT 'unknown' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "weapon_recommended_characters_weapon_id_character_id_pk" PRIMARY KEY("weapon_id","character_id")
);
--> statement-breakpoint
CREATE TABLE "weapon_refinements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"weapon_id" uuid NOT NULL,
	"rank" integer NOT NULL,
	"effect_text" text NOT NULL,
	"effect_json" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"source_status" "source_status" DEFAULT 'unknown' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "weapons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"external_id" text NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"rarity_id" uuid,
	"arc_type_id" uuid,
	"quote" text,
	"description" text,
	"main_stat_id" uuid,
	"main_stat_value" numeric,
	"sub_stat_id" uuid,
	"sub_stat_value" numeric,
	"source_status" "source_status" DEFAULT 'unknown' NOT NULL,
	"publication_status" "publication_status" DEFAULT 'draft' NOT NULL,
	"raw" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "weapons_external_id_unique" UNIQUE("external_id"),
	CONSTRAINT "weapons_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "cartridge_compatible_shapes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cartridge_set_id" uuid NOT NULL,
	"slot_index" integer NOT NULL,
	"module_shape_id" uuid,
	"shape_external_id" text,
	"source_status" "source_status" DEFAULT 'needs_verification' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cartridge_set_bonuses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cartridge_set_id" uuid NOT NULL,
	"pieces" integer NOT NULL,
	"effect_text" text NOT NULL,
	"effect_json" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"is_conditional" boolean DEFAULT false NOT NULL,
	"source_status" "source_status" DEFAULT 'unknown' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cartridge_sets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"external_id" text NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"element_id" uuid,
	"bonus_category" text,
	"description" text,
	"data_status" text,
	"source_status" "source_status" DEFAULT 'unknown' NOT NULL,
	"publication_status" "publication_status" DEFAULT 'draft' NOT NULL,
	"raw" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "cartridge_sets_external_id_unique" UNIQUE("external_id"),
	CONSTRAINT "cartridge_sets_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "module_pieces" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"external_id" text NOT NULL,
	"slug" text NOT NULL,
	"module_shape_id" uuid,
	"rarity_id" uuid,
	"module_type" text NOT NULL,
	"name" text NOT NULL,
	"main_stat_id" uuid,
	"main_stat_value" numeric,
	"substats_json" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"source_status" "source_status" DEFAULT 'unknown' NOT NULL,
	"raw" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "module_pieces_external_id_unique" UNIQUE("external_id"),
	CONSTRAINT "module_pieces_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "module_shapes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"external_id" text NOT NULL,
	"slug" text NOT NULL,
	"module_type" text NOT NULL,
	"name" text NOT NULL,
	"width" integer,
	"height" integer,
	"cell_count" integer,
	"matrix_json" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"source_status" "source_status" DEFAULT 'unknown' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "module_shapes_external_id_unique" UNIQUE("external_id"),
	CONSTRAINT "module_shapes_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "vehicle_acquisition" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vehicle_id" uuid NOT NULL,
	"currency" text,
	"price" numeric,
	"acquisition_text" text,
	"source_status" "source_status" DEFAULT 'unknown' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vehicle_stats" (
	"vehicle_id" uuid PRIMARY KEY NOT NULL,
	"max_speed" numeric,
	"acceleration" numeric,
	"durability" numeric,
	"handling_json" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"source_status" "source_status" DEFAULT 'unknown' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vehicles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"external_id" text NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"vehicle_type" text NOT NULL,
	"description" text,
	"media_asset_id" uuid,
	"source_status" "source_status" DEFAULT 'unknown' NOT NULL,
	"publication_status" "publication_status" DEFAULT 'draft' NOT NULL,
	"raw" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "vehicles_external_id_unique" UNIQUE("external_id"),
	CONSTRAINT "vehicles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "tier_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tier_list_id" uuid NOT NULL,
	"tier_row_id" uuid NOT NULL,
	"character_id" uuid NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"note" text,
	"source_status" "source_status" DEFAULT 'unknown' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tier_lists" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"external_id" text NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"list_type" "tier_list_type" DEFAULT 'official' NOT NULL,
	"owner_user_id" uuid,
	"settings_json" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"source_status" "source_status" DEFAULT 'unknown' NOT NULL,
	"publication_status" "publication_status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tier_lists_external_id_unique" UNIQUE("external_id"),
	CONSTRAINT "tier_lists_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "tier_rows" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tier_list_id" uuid NOT NULL,
	"external_id" text,
	"label" text NOT NULL,
	"subtitle" text,
	"color" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_tier_lists" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"tier_list_id" uuid NOT NULL,
	"visibility" "visibility_status" DEFAULT 'private' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "apartment_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"external_id" text NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"category" text,
	"description" text,
	"price" numeric,
	"currency" text,
	"media_asset_id" uuid,
	"source_status" "source_status" DEFAULT 'placeholder' NOT NULL,
	"publication_status" "publication_status" DEFAULT 'draft' NOT NULL,
	"raw" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "apartment_items_external_id_unique" UNIQUE("external_id"),
	CONSTRAINT "apartment_items_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "codes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"external_id" text NOT NULL,
	"code" text NOT NULL,
	"reward_summary" text,
	"status" text DEFAULT 'unknown' NOT NULL,
	"start_date" timestamp with time zone,
	"end_date" timestamp with time zone,
	"source_url" text,
	"source_status" "source_status" DEFAULT 'unknown' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "codes_external_id_unique" UNIQUE("external_id"),
	CONSTRAINT "codes_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "community_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"external_id" text NOT NULL,
	"label" text NOT NULL,
	"url" text NOT NULL,
	"category" text,
	"description" text,
	"source_status" "source_status" DEFAULT 'placeholder' NOT NULL,
	"publication_status" "publication_status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "community_links_external_id_unique" UNIQUE("external_id")
);
--> statement-breakpoint
CREATE TABLE "guide_sections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guide_id" uuid NOT NULL,
	"heading" text,
	"body" text,
	"sort_order" numeric DEFAULT '0' NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "guides" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"external_id" text NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"category" text,
	"summary" text,
	"author_user_id" uuid,
	"source_status" "source_status" DEFAULT 'placeholder' NOT NULL,
	"publication_status" "publication_status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "guides_external_id_unique" UNIQUE("external_id"),
	CONSTRAINT "guides_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "news_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"external_id" text NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"body" text,
	"category" text,
	"posted_at" timestamp with time zone,
	"source_url" text,
	"image_media_asset_id" uuid,
	"featured" boolean DEFAULT false NOT NULL,
	"pinned" boolean DEFAULT false NOT NULL,
	"source_status" "source_status" DEFAULT 'placeholder' NOT NULL,
	"publication_status" "publication_status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "news_posts_external_id_unique" UNIQUE("external_id"),
	CONSTRAINT "news_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "admin_logs" ADD CONSTRAINT "admin_logs_admin_user_id_users_id_fk" FOREIGN KEY ("admin_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_auth_role_id_auth_roles_id_fk" FOREIGN KEY ("auth_role_id") REFERENCES "public"."auth_roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_materials" ADD CONSTRAINT "character_materials_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_materials" ADD CONSTRAINT "character_materials_material_id_materials_id_fk" FOREIGN KEY ("material_id") REFERENCES "public"."materials"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_roles" ADD CONSTRAINT "character_roles_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_roles" ADD CONSTRAINT "character_roles_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_skills" ADD CONSTRAINT "character_skills_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_stats" ADD CONSTRAINT "character_stats_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_stats" ADD CONSTRAINT "character_stats_stat_id_stats_id_fk" FOREIGN KEY ("stat_id") REFERENCES "public"."stats"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_tags" ADD CONSTRAINT "character_tags_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_tags" ADD CONSTRAINT "character_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_voice_actors" ADD CONSTRAINT "character_voice_actors_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "characters" ADD CONSTRAINT "characters_rarity_id_rarities_id_fk" FOREIGN KEY ("rarity_id") REFERENCES "public"."rarities"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "characters" ADD CONSTRAINT "characters_element_id_elements_id_fk" FOREIGN KEY ("element_id") REFERENCES "public"."elements"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "characters" ADD CONSTRAINT "characters_arc_type_id_arc_types_id_fk" FOREIGN KEY ("arc_type_id") REFERENCES "public"."arc_types"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "materials" ADD CONSTRAINT "materials_rarity_id_rarities_id_fk" FOREIGN KEY ("rarity_id") REFERENCES "public"."rarities"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "materials" ADD CONSTRAINT "materials_media_asset_id_media_assets_id_fk" FOREIGN KEY ("media_asset_id") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weapon_growth_stats" ADD CONSTRAINT "weapon_growth_stats_weapon_id_weapons_id_fk" FOREIGN KEY ("weapon_id") REFERENCES "public"."weapons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weapon_growth_stats" ADD CONSTRAINT "weapon_growth_stats_stat_id_stats_id_fk" FOREIGN KEY ("stat_id") REFERENCES "public"."stats"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weapon_recommended_characters" ADD CONSTRAINT "weapon_recommended_characters_weapon_id_weapons_id_fk" FOREIGN KEY ("weapon_id") REFERENCES "public"."weapons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weapon_recommended_characters" ADD CONSTRAINT "weapon_recommended_characters_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weapon_refinements" ADD CONSTRAINT "weapon_refinements_weapon_id_weapons_id_fk" FOREIGN KEY ("weapon_id") REFERENCES "public"."weapons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weapons" ADD CONSTRAINT "weapons_rarity_id_rarities_id_fk" FOREIGN KEY ("rarity_id") REFERENCES "public"."rarities"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weapons" ADD CONSTRAINT "weapons_arc_type_id_arc_types_id_fk" FOREIGN KEY ("arc_type_id") REFERENCES "public"."arc_types"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weapons" ADD CONSTRAINT "weapons_main_stat_id_stats_id_fk" FOREIGN KEY ("main_stat_id") REFERENCES "public"."stats"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weapons" ADD CONSTRAINT "weapons_sub_stat_id_stats_id_fk" FOREIGN KEY ("sub_stat_id") REFERENCES "public"."stats"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cartridge_compatible_shapes" ADD CONSTRAINT "cartridge_compatible_shapes_cartridge_set_id_cartridge_sets_id_fk" FOREIGN KEY ("cartridge_set_id") REFERENCES "public"."cartridge_sets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cartridge_compatible_shapes" ADD CONSTRAINT "cartridge_compatible_shapes_module_shape_id_module_shapes_id_fk" FOREIGN KEY ("module_shape_id") REFERENCES "public"."module_shapes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cartridge_set_bonuses" ADD CONSTRAINT "cartridge_set_bonuses_cartridge_set_id_cartridge_sets_id_fk" FOREIGN KEY ("cartridge_set_id") REFERENCES "public"."cartridge_sets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cartridge_sets" ADD CONSTRAINT "cartridge_sets_element_id_elements_id_fk" FOREIGN KEY ("element_id") REFERENCES "public"."elements"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "module_pieces" ADD CONSTRAINT "module_pieces_module_shape_id_module_shapes_id_fk" FOREIGN KEY ("module_shape_id") REFERENCES "public"."module_shapes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "module_pieces" ADD CONSTRAINT "module_pieces_rarity_id_rarities_id_fk" FOREIGN KEY ("rarity_id") REFERENCES "public"."rarities"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "module_pieces" ADD CONSTRAINT "module_pieces_main_stat_id_stats_id_fk" FOREIGN KEY ("main_stat_id") REFERENCES "public"."stats"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicle_acquisition" ADD CONSTRAINT "vehicle_acquisition_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicle_stats" ADD CONSTRAINT "vehicle_stats_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_media_asset_id_media_assets_id_fk" FOREIGN KEY ("media_asset_id") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tier_entries" ADD CONSTRAINT "tier_entries_tier_list_id_tier_lists_id_fk" FOREIGN KEY ("tier_list_id") REFERENCES "public"."tier_lists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tier_entries" ADD CONSTRAINT "tier_entries_tier_row_id_tier_rows_id_fk" FOREIGN KEY ("tier_row_id") REFERENCES "public"."tier_rows"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tier_entries" ADD CONSTRAINT "tier_entries_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tier_lists" ADD CONSTRAINT "tier_lists_owner_user_id_users_id_fk" FOREIGN KEY ("owner_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tier_rows" ADD CONSTRAINT "tier_rows_tier_list_id_tier_lists_id_fk" FOREIGN KEY ("tier_list_id") REFERENCES "public"."tier_lists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_tier_lists" ADD CONSTRAINT "user_tier_lists_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_tier_lists" ADD CONSTRAINT "user_tier_lists_tier_list_id_tier_lists_id_fk" FOREIGN KEY ("tier_list_id") REFERENCES "public"."tier_lists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "apartment_items" ADD CONSTRAINT "apartment_items_media_asset_id_media_assets_id_fk" FOREIGN KEY ("media_asset_id") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guide_sections" ADD CONSTRAINT "guide_sections_guide_id_guides_id_fk" FOREIGN KEY ("guide_id") REFERENCES "public"."guides"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guides" ADD CONSTRAINT "guides_author_user_id_users_id_fk" FOREIGN KEY ("author_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "news_posts" ADD CONSTRAINT "news_posts_image_media_asset_id_media_assets_id_fk" FOREIGN KEY ("image_media_asset_id") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "idx_stats_external_id" ON "stats" USING btree ("external_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_characters_external_id" ON "characters" USING btree ("external_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_characters_slug" ON "characters" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_tier_entries_list_character" ON "tier_entries" USING btree ("tier_list_id","character_id");