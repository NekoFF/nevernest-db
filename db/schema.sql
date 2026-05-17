CREATE TABLE module_rarities (
  id INTEGER PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  color_token TEXT NOT NULL,
  sort_order INTEGER NOT NULL
);

CREATE TABLE module_types (
  id INTEGER PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  cell_count INTEGER NOT NULL,
  sort_order INTEGER NOT NULL
);

CREATE TABLE module_shapes (
  id INTEGER PRIMARY KEY,
  type_id INTEGER NOT NULL REFERENCES module_types(id),
  shape_key TEXT NOT NULL,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  cells_json JSONB NOT NULL,
  sort_order INTEGER NOT NULL,
  UNIQUE (type_id, shape_key)
);

CREATE TABLE modules (
  id INTEGER PRIMARY KEY,
  rarity_id INTEGER NOT NULL REFERENCES module_rarities(id),
  type_id INTEGER NOT NULL REFERENCES module_types(id),
  shape_id INTEGER NOT NULL REFERENCES module_shapes(id),
  display_name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL
);

CREATE TABLE module_stat_templates (
  id INTEGER PRIMARY KEY,
  module_id INTEGER NOT NULL REFERENCES modules(id),
  stat_key TEXT NOT NULL,
  min_value NUMERIC,
  max_value NUMERIC,
  value_type TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE module_substat_pools (
  id INTEGER PRIMARY KEY,
  module_id INTEGER NOT NULL REFERENCES modules(id),
  stat_key TEXT NOT NULL,
  weight INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);
