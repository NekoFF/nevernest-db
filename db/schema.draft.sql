-- Neverness to Everness Community Database
-- PostgreSQL schema draft, Phase 3.
--
-- This is a planning artifact only. Do not run it as a production migration yet.
-- The current app remains a Vite/React frontend with static JS seed data and localStorage.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Shared source quality model from src/data/sourceStatus.js.
CREATE TYPE source_status AS ENUM (
  'verified',
  'needs_verification',
  'estimated',
  'placeholder',
  'mock',
  'unknown'
);

CREATE TYPE publication_status AS ENUM (
  'draft',
  'published',
  'archived',
  'hidden'
);

CREATE TYPE tier_list_type AS ENUM (
  'official',
  'user',
  'event',
  'draft'
);

CREATE TYPE visibility_status AS ENUM (
  'private',
  'unlisted',
  'public'
);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------------------
-- Core taxonomy
-- ---------------------------------------------------------------------------

CREATE TABLE elements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  color TEXT,
  icon_key TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  source_status source_status NOT NULL DEFAULT 'unknown',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE arc_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  icon_key TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  source_status source_status NOT NULL DEFAULT 'unknown',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE rarities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  rank_label TEXT,
  color TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  source_status source_status NOT NULL DEFAULT 'unknown',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Gameplay roles only. Auth/admin roles live in auth_roles.
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  aliases TEXT[] NOT NULL DEFAULT '{}',
  sort_order INTEGER NOT NULL DEFAULT 0,
  source_status source_status NOT NULL DEFAULT 'unknown',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Descriptive/freeform tags, separate from gameplay roles.
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  aliases TEXT[] NOT NULL DEFAULT '{}',
  sort_order INTEGER NOT NULL DEFAULT 0,
  source_status source_status NOT NULL DEFAULT 'unknown',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  display_name TEXT,
  category TEXT NOT NULL,
  value_type TEXT NOT NULL CHECK (value_type IN ('flat', 'percent', 'integer', 'text')),
  icon_key TEXT,
  allowed_as_main_stat BOOLEAN NOT NULL DEFAULT FALSE,
  allowed_as_sub_stat BOOLEAN NOT NULL DEFAULT FALSE,
  allowed_as_weapon_sub_stat BOOLEAN NOT NULL DEFAULT FALSE,
  allowed_as_character_stat BOOLEAN NOT NULL DEFAULT TRUE,
  aliases TEXT[] NOT NULL DEFAULT '{}',
  sort_order INTEGER NOT NULL DEFAULT 0,
  source_status source_status NOT NULL DEFAULT 'unknown',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (external_id NOT LIKE 'mental_%')
);

COMMENT ON TABLE stats IS 'Canonical stat registry. Cognitive/Mental variants must map to one canonical id, currently cognitive_*; do not create duplicate mental_* stat rows.';

-- ---------------------------------------------------------------------------
-- Users and future auth/admin
-- ---------------------------------------------------------------------------

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT UNIQUE,
  email TEXT UNIQUE,
  display_name TEXT,
  avatar_media_id UUID,
  status publication_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE auth_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  provider_account_id TEXT NOT NULL,
  email TEXT,
  password_hash TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (provider, provider_account_id)
);

CREATE TABLE auth_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  permissions JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE user_roles (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  auth_role_id UUID NOT NULL REFERENCES auth_roles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, auth_role_id)
);

CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Media
-- ---------------------------------------------------------------------------

CREATE TABLE media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT NOT NULL UNIQUE,
  entity_type TEXT NOT NULL,
  entity_external_id TEXT NOT NULL,
  resolved_entity_external_id TEXT NOT NULL,
  kind TEXT NOT NULL,
  path TEXT NOT NULL,
  alt TEXT,
  source_url TEXT,
  license_note TEXT,
  width INTEGER CHECK (width IS NULL OR width > 0),
  height INTEGER CHECK (height IS NULL OR height > 0),
  source_status source_status NOT NULL DEFAULT 'unknown',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE media_assets IS 'Media registry entries. entity_external_id preserves filename-derived ids; resolved_entity_external_id applies explicit aliases from src/data/mediaAliases.js for SQL-safe entity links.';

ALTER TABLE users
  ADD CONSTRAINT users_avatar_media_id_fkey
  FOREIGN KEY (avatar_media_id) REFERENCES media_assets(id) ON DELETE SET NULL;

-- ---------------------------------------------------------------------------
-- Characters
-- ---------------------------------------------------------------------------

CREATE TABLE characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  rarity_id UUID REFERENCES rarities(id) ON DELETE SET NULL,
  element_id UUID REFERENCES elements(id) ON DELETE SET NULL,
  arc_type_id UUID REFERENCES arc_types(id) ON DELETE SET NULL,
  faction TEXT,
  birthday TEXT,
  esper_ability TEXT,
  profile_text TEXT,
  description TEXT,
  quote TEXT,
  source_status source_status NOT NULL DEFAULT 'unknown',
  publication_status publication_status NOT NULL DEFAULT 'draft',
  raw JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE characters IS 'Core NTE character identity records. Use external_id for stable frontend/API ids; optional related tables allow sparse import because current character data depth is uneven.';

CREATE TABLE character_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  locale TEXT NOT NULL,
  field_name TEXT NOT NULL,
  value TEXT NOT NULL,
  source_status source_status NOT NULL DEFAULT 'unknown',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (character_id, locale, field_name)
);

CREATE TABLE character_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  stat_id UUID NOT NULL REFERENCES stats(id) ON DELETE RESTRICT,
  level INTEGER,
  value NUMERIC,
  value_text TEXT,
  source_status source_status NOT NULL DEFAULT 'unknown',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (character_id, stat_id, level)
);

COMMENT ON TABLE character_stats IS 'Character stat rows by level/source. source_status is required because many current stat values are fallback, estimated, or incomplete.';

CREATE TABLE character_roles (
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
  source_status source_status NOT NULL DEFAULT 'unknown',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (character_id, role_id)
);

CREATE TABLE character_tags (
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE RESTRICT,
  source_status source_status NOT NULL DEFAULT 'unknown',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (character_id, tag_id)
);

CREATE TABLE character_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT,
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  skill_type TEXT NOT NULL,
  description TEXT,
  max_level INTEGER,
  effect_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  source_status source_status NOT NULL DEFAULT 'unknown',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (character_id, external_id)
);

COMMENT ON TABLE character_skills IS 'Text-first skill records with JSONB reserved for later parsed formulas/effects.';

CREATE TABLE character_skill_scaling (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id UUID NOT NULL REFERENCES character_skills(id) ON DELETE CASCADE,
  level INTEGER NOT NULL,
  label TEXT NOT NULL,
  value NUMERIC,
  value_text TEXT,
  value_type TEXT,
  source_status source_status NOT NULL DEFAULT 'unknown',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  rarity_id UUID REFERENCES rarities(id) ON DELETE SET NULL,
  category TEXT,
  source_text TEXT,
  media_asset_id UUID REFERENCES media_assets(id) ON DELETE SET NULL,
  source_status source_status NOT NULL DEFAULT 'unknown',
  raw JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE character_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  material_id UUID REFERENCES materials(id) ON DELETE SET NULL,
  material_name TEXT,
  context TEXT NOT NULL,
  level INTEGER,
  amount INTEGER CHECK (amount IS NULL OR amount >= 0),
  source_status source_status NOT NULL DEFAULT 'unknown',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE character_voice_actors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  locale TEXT NOT NULL,
  actor_name TEXT NOT NULL,
  source_url TEXT,
  source_status source_status NOT NULL DEFAULT 'unknown',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE character_banner_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  banner_name TEXT NOT NULL,
  version TEXT,
  start_date DATE,
  end_date DATE,
  source_url TEXT,
  source_status source_status NOT NULL DEFAULT 'unknown',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE character_quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  locale TEXT NOT NULL DEFAULT 'en',
  context TEXT,
  quote TEXT NOT NULL,
  source_status source_status NOT NULL DEFAULT 'unknown',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE character_personal_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  media_asset_id UUID REFERENCES media_assets(id) ON DELETE SET NULL,
  source_status source_status NOT NULL DEFAULT 'unknown',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE character_build_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('weapon', 'cartridge', 'stat', 'team', 'note')),
  target_external_id TEXT,
  priority INTEGER NOT NULL DEFAULT 0,
  note TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  source_status source_status NOT NULL DEFAULT 'unknown',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE character_team_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  team_name TEXT,
  member_character_id UUID REFERENCES characters(id) ON DELETE SET NULL,
  member_external_id TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  note TEXT,
  source_status source_status NOT NULL DEFAULT 'unknown',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Weapons / Arcs
-- ---------------------------------------------------------------------------

CREATE TABLE weapons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  rarity_id UUID REFERENCES rarities(id) ON DELETE SET NULL,
  arc_type_id UUID REFERENCES arc_types(id) ON DELETE SET NULL,
  quote TEXT,
  description TEXT,
  main_stat_id UUID REFERENCES stats(id) ON DELETE SET NULL,
  main_stat_value NUMERIC,
  sub_stat_id UUID REFERENCES stats(id) ON DELETE SET NULL,
  sub_stat_value NUMERIC,
  source_status source_status NOT NULL DEFAULT 'unknown',
  publication_status publication_status NOT NULL DEFAULT 'draft',
  raw JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE weapons IS 'Weapon/Arc records. Current seed data is relatively structured; effects remain text-first with JSONB reserved for parsed formulas.';

CREATE TABLE weapon_refinements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  weapon_id UUID NOT NULL REFERENCES weapons(id) ON DELETE CASCADE,
  rank INTEGER NOT NULL CHECK (rank > 0),
  effect_text TEXT NOT NULL,
  effect_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  source_status source_status NOT NULL DEFAULT 'unknown',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (weapon_id, rank)
);

CREATE TABLE weapon_growth_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  weapon_id UUID NOT NULL REFERENCES weapons(id) ON DELETE CASCADE,
  level INTEGER NOT NULL CHECK (level > 0),
  stat_id UUID NOT NULL REFERENCES stats(id) ON DELETE RESTRICT,
  value NUMERIC NOT NULL,
  source_status source_status NOT NULL DEFAULT 'unknown',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (weapon_id, level, stat_id)
);

CREATE TABLE weapon_recommended_characters (
  weapon_id UUID NOT NULL REFERENCES weapons(id) ON DELETE CASCADE,
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  priority INTEGER NOT NULL DEFAULT 0,
  note TEXT,
  source_status source_status NOT NULL DEFAULT 'unknown',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (weapon_id, character_id)
);

-- ---------------------------------------------------------------------------
-- Cartridges / Modules
-- ---------------------------------------------------------------------------

CREATE TABLE cartridge_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  element_id UUID REFERENCES elements(id) ON DELETE SET NULL,
  bonus_category TEXT,
  description TEXT,
  data_status TEXT,
  source_status source_status NOT NULL DEFAULT 'unknown',
  publication_status publication_status NOT NULL DEFAULT 'draft',
  raw JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE cartridge_sets IS 'Cartridge set identity and display data. Compatible shape rows should remain needs_verification until source-checked.';

CREATE TABLE cartridge_set_bonuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cartridge_set_id UUID NOT NULL REFERENCES cartridge_sets(id) ON DELETE CASCADE,
  pieces INTEGER NOT NULL CHECK (pieces > 0),
  effect_text TEXT NOT NULL,
  effect_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_conditional BOOLEAN NOT NULL DEFAULT FALSE,
  source_status source_status NOT NULL DEFAULT 'unknown',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (cartridge_set_id, pieces)
);

CREATE TABLE module_shapes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  module_type TEXT NOT NULL,
  name TEXT NOT NULL,
  width INTEGER,
  height INTEGER,
  cell_count INTEGER,
  matrix_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  source_status source_status NOT NULL DEFAULT 'unknown',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE module_shapes IS 'Module shape catalog. matrix_json stores the shape grid from frontend moduleCatalog data.';

CREATE TABLE module_pieces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  rarity_id UUID REFERENCES rarities(id) ON DELETE SET NULL,
  module_shape_id UUID NOT NULL REFERENCES module_shapes(id) ON DELETE CASCADE,
  module_type TEXT NOT NULL,
  display_name TEXT NOT NULL,
  max_level INTEGER,
  source_status source_status NOT NULL DEFAULT 'unknown',
  generated_from_template BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE cartridge_compatible_shapes (
  cartridge_set_id UUID NOT NULL REFERENCES cartridge_sets(id) ON DELETE CASCADE,
  module_shape_id UUID NOT NULL REFERENCES module_shapes(id) ON DELETE CASCADE,
  slot INTEGER,
  notes TEXT,
  source_status source_status NOT NULL DEFAULT 'needs_verification',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (cartridge_set_id, module_shape_id, slot)
);

CREATE TABLE module_stat_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rarity_id UUID REFERENCES rarities(id) ON DELETE SET NULL,
  module_type TEXT,
  stat_id UUID NOT NULL REFERENCES stats(id) ON DELETE RESTRICT,
  slot_type TEXT NOT NULL CHECK (slot_type IN ('main', 'sub')),
  min_value NUMERIC,
  max_value NUMERIC,
  fixed_value NUMERIC,
  value_type TEXT,
  source_status source_status NOT NULL DEFAULT 'unknown',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Vehicles
-- ---------------------------------------------------------------------------

CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  vehicle_type TEXT NOT NULL,
  description TEXT,
  media_asset_id UUID REFERENCES media_assets(id) ON DELETE SET NULL,
  source_status source_status NOT NULL DEFAULT 'unknown',
  publication_status publication_status NOT NULL DEFAULT 'draft',
  raw JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE vehicle_stats (
  vehicle_id UUID PRIMARY KEY REFERENCES vehicles(id) ON DELETE CASCADE,
  max_speed NUMERIC,
  acceleration NUMERIC,
  durability NUMERIC,
  handling_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  source_status source_status NOT NULL DEFAULT 'unknown',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE vehicle_acquisition (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  currency TEXT,
  price NUMERIC,
  acquisition_text TEXT,
  source_status source_status NOT NULL DEFAULT 'unknown',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Tier lists
-- ---------------------------------------------------------------------------

CREATE TABLE tier_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  list_type tier_list_type NOT NULL DEFAULT 'official',
  owner_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  settings_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  source_status source_status NOT NULL DEFAULT 'unknown',
  publication_status publication_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE tier_rows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tier_list_id UUID NOT NULL REFERENCES tier_lists(id) ON DELETE CASCADE,
  external_id TEXT,
  label TEXT NOT NULL,
  subtitle TEXT,
  color TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tier_list_id, label)
);

CREATE TABLE tier_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tier_list_id UUID NOT NULL REFERENCES tier_lists(id) ON DELETE CASCADE,
  tier_row_id UUID NOT NULL REFERENCES tier_rows(id) ON DELETE CASCADE,
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  position INTEGER NOT NULL DEFAULT 0,
  note TEXT,
  source_status source_status NOT NULL DEFAULT 'unknown',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tier_list_id, character_id)
);

CREATE TABLE user_tier_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tier_list_id UUID NOT NULL REFERENCES tier_lists(id) ON DELETE CASCADE,
  visibility visibility_status NOT NULL DEFAULT 'private',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, tier_list_id)
);

-- ---------------------------------------------------------------------------
-- Build Planner
-- ---------------------------------------------------------------------------

CREATE TABLE build_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT UNIQUE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  planner_version INTEGER NOT NULL DEFAULT 1,
  active_slot_index INTEGER NOT NULL DEFAULT 0,
  state_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  visibility visibility_status NOT NULL DEFAULT 'private',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE build_drafts IS 'User-owned Build Planner drafts. state_json preserves unstable planner fields while relational slot tables capture stable character/weapon/module links.';

CREATE TABLE build_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draft_id UUID NOT NULL REFERENCES build_drafts(id) ON DELETE CASCADE,
  slot_index INTEGER NOT NULL,
  character_id UUID REFERENCES characters(id) ON DELETE SET NULL,
  level INTEGER,
  weapon_id UUID REFERENCES weapons(id) ON DELETE SET NULL,
  weapon_level INTEGER,
  cartridge_set_id UUID REFERENCES cartridge_sets(id) ON DELETE SET NULL,
  cartridge_rarity_id UUID REFERENCES rarities(id) ON DELETE SET NULL,
  slot_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (draft_id, slot_index)
);

CREATE TABLE build_slot_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id UUID NOT NULL REFERENCES build_slots(id) ON DELETE CASCADE,
  module_shape_id UUID REFERENCES module_shapes(id) ON DELETE SET NULL,
  rarity_id UUID REFERENCES rarities(id) ON DELETE SET NULL,
  grid_x INTEGER,
  grid_y INTEGER,
  rotation INTEGER NOT NULL DEFAULT 0,
  main_stat_id UUID REFERENCES stats(id) ON DELETE SET NULL,
  substats_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  module_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE build_slot_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id UUID NOT NULL REFERENCES build_slots(id) ON DELETE CASCADE,
  stat_id UUID NOT NULL REFERENCES stats(id) ON DELETE RESTRICT,
  value NUMERIC NOT NULL,
  source_breakdown_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (slot_id, stat_id)
);

CREATE TABLE build_effect_toggles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id UUID NOT NULL REFERENCES build_slots(id) ON DELETE CASCADE,
  effect_external_id TEXT NOT NULL,
  effect_type TEXT,
  enabled BOOLEAN NOT NULL DEFAULT FALSE,
  stacks INTEGER NOT NULL DEFAULT 0,
  effect_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (slot_id, effect_external_id)
);

CREATE TABLE saved_builds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draft_id UUID REFERENCES build_drafts(id) ON DELETE SET NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  visibility visibility_status NOT NULL DEFAULT 'public',
  rating NUMERIC,
  snapshot_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Content
-- ---------------------------------------------------------------------------

CREATE TABLE guides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  category TEXT,
  summary TEXT,
  author_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  source_status source_status NOT NULL DEFAULT 'placeholder',
  publication_status publication_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE guide_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id UUID NOT NULL REFERENCES guides(id) ON DELETE CASCADE,
  heading TEXT,
  body TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  reward_summary TEXT,
  status TEXT NOT NULL CHECK (status IN ('active', 'expired', 'unknown')),
  start_date DATE,
  end_date DATE,
  source_url TEXT,
  source_status source_status NOT NULL DEFAULT 'unknown',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE news_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  body TEXT,
  category TEXT,
  posted_at TIMESTAMPTZ,
  source_url TEXT,
  image_media_asset_id UUID REFERENCES media_assets(id) ON DELETE SET NULL,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  pinned BOOLEAN NOT NULL DEFAULT FALSE,
  source_status source_status NOT NULL DEFAULT 'placeholder',
  publication_status publication_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE community_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT,
  description TEXT,
  source_status source_status NOT NULL DEFAULT 'placeholder',
  publication_status publication_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE apartment_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT,
  description TEXT,
  price NUMERIC,
  currency TEXT,
  media_asset_id UUID REFERENCES media_assets(id) ON DELETE SET NULL,
  source_status source_status NOT NULL DEFAULT 'placeholder',
  publication_status publication_status NOT NULL DEFAULT 'draft',
  raw JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Admin audit trail
-- ---------------------------------------------------------------------------

CREATE TABLE admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  entity_external_id TEXT,
  action TEXT NOT NULL,
  before_json JSONB,
  after_json JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE admin_logs IS 'Future backend audit trail for admin CRUD. Local-only AdminMode must not be treated as secure until real auth and this logging path exist.';

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

CREATE INDEX idx_characters_filters ON characters (rarity_id, element_id, arc_type_id);
CREATE INDEX idx_characters_external_id ON characters (external_id);
CREATE INDEX idx_characters_slug ON characters (slug);
CREATE INDEX idx_character_stats_character ON character_stats (character_id, level);
CREATE INDEX idx_character_skills_character ON character_skills (character_id, sort_order);

CREATE INDEX idx_weapons_filters ON weapons (rarity_id, arc_type_id);
CREATE INDEX idx_weapons_external_id ON weapons (external_id);
CREATE INDEX idx_weapons_slug ON weapons (slug);
CREATE INDEX idx_weapon_growth_stats_weapon ON weapon_growth_stats (weapon_id, level);

CREATE INDEX idx_cartridge_sets_slug ON cartridge_sets (slug);
CREATE INDEX idx_cartridge_sets_element ON cartridge_sets (element_id);
CREATE INDEX idx_cartridge_compatible_shapes_shape ON cartridge_compatible_shapes (module_shape_id);
CREATE INDEX idx_module_pieces_shape_rarity ON module_pieces (module_shape_id, rarity_id);

CREATE INDEX idx_media_entity_lookup ON media_assets (entity_type, resolved_entity_external_id, kind);
CREATE INDEX idx_media_external_id ON media_assets (external_id);

CREATE INDEX idx_tier_entries_list_row ON tier_entries (tier_list_id, tier_row_id, position);
CREATE INDEX idx_tier_entries_character ON tier_entries (character_id);
CREATE INDEX idx_user_tier_lists_user ON user_tier_lists (user_id);

CREATE INDEX idx_build_drafts_user ON build_drafts (user_id, updated_at DESC);
CREATE INDEX idx_build_slots_draft ON build_slots (draft_id, slot_index);
CREATE INDEX idx_saved_builds_user_visibility ON saved_builds (user_id, visibility);

CREATE INDEX idx_codes_status_dates ON codes (status, start_date, end_date);
CREATE INDEX idx_news_posts_status_date ON news_posts (publication_status, posted_at DESC);
CREATE INDEX idx_admin_logs_entity ON admin_logs (entity_type, entity_external_id, created_at DESC);
CREATE INDEX idx_admin_logs_admin ON admin_logs (admin_user_id, created_at DESC);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------

CREATE TRIGGER trg_elements_updated_at BEFORE UPDATE ON elements FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_arc_types_updated_at BEFORE UPDATE ON arc_types FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_rarities_updated_at BEFORE UPDATE ON rarities FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_roles_updated_at BEFORE UPDATE ON roles FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_tags_updated_at BEFORE UPDATE ON tags FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_stats_updated_at BEFORE UPDATE ON stats FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_auth_accounts_updated_at BEFORE UPDATE ON auth_accounts FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_auth_roles_updated_at BEFORE UPDATE ON auth_roles FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_media_assets_updated_at BEFORE UPDATE ON media_assets FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_characters_updated_at BEFORE UPDATE ON characters FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_character_translations_updated_at BEFORE UPDATE ON character_translations FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_character_stats_updated_at BEFORE UPDATE ON character_stats FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_character_skills_updated_at BEFORE UPDATE ON character_skills FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_character_skill_scaling_updated_at BEFORE UPDATE ON character_skill_scaling FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_materials_updated_at BEFORE UPDATE ON materials FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_character_materials_updated_at BEFORE UPDATE ON character_materials FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_character_voice_actors_updated_at BEFORE UPDATE ON character_voice_actors FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_character_banner_history_updated_at BEFORE UPDATE ON character_banner_history FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_character_quotes_updated_at BEFORE UPDATE ON character_quotes FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_character_personal_items_updated_at BEFORE UPDATE ON character_personal_items FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_character_build_recommendations_updated_at BEFORE UPDATE ON character_build_recommendations FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_character_team_recommendations_updated_at BEFORE UPDATE ON character_team_recommendations FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_weapons_updated_at BEFORE UPDATE ON weapons FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_weapon_refinements_updated_at BEFORE UPDATE ON weapon_refinements FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_weapon_growth_stats_updated_at BEFORE UPDATE ON weapon_growth_stats FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_cartridge_sets_updated_at BEFORE UPDATE ON cartridge_sets FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_cartridge_set_bonuses_updated_at BEFORE UPDATE ON cartridge_set_bonuses FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_module_shapes_updated_at BEFORE UPDATE ON module_shapes FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_module_pieces_updated_at BEFORE UPDATE ON module_pieces FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_module_stat_templates_updated_at BEFORE UPDATE ON module_stat_templates FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_vehicles_updated_at BEFORE UPDATE ON vehicles FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_vehicle_stats_updated_at BEFORE UPDATE ON vehicle_stats FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_vehicle_acquisition_updated_at BEFORE UPDATE ON vehicle_acquisition FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_tier_lists_updated_at BEFORE UPDATE ON tier_lists FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_tier_rows_updated_at BEFORE UPDATE ON tier_rows FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_tier_entries_updated_at BEFORE UPDATE ON tier_entries FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_user_tier_lists_updated_at BEFORE UPDATE ON user_tier_lists FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_build_drafts_updated_at BEFORE UPDATE ON build_drafts FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_build_slots_updated_at BEFORE UPDATE ON build_slots FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_build_slot_modules_updated_at BEFORE UPDATE ON build_slot_modules FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_build_slot_stats_updated_at BEFORE UPDATE ON build_slot_stats FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_build_effect_toggles_updated_at BEFORE UPDATE ON build_effect_toggles FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_saved_builds_updated_at BEFORE UPDATE ON saved_builds FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_guides_updated_at BEFORE UPDATE ON guides FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_guide_sections_updated_at BEFORE UPDATE ON guide_sections FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_codes_updated_at BEFORE UPDATE ON codes FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_news_posts_updated_at BEFORE UPDATE ON news_posts FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_community_links_updated_at BEFORE UPDATE ON community_links FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_apartment_items_updated_at BEFORE UPDATE ON apartment_items FOR EACH ROW EXECUTE FUNCTION set_updated_at();

