CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS games (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  developer TEXT,
  release_year INTEGER CHECK (release_year IS NULL OR release_year BETWEEN 1950 AND 2100),
  genre TEXT,
  cover_url TEXT,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'backlog' CHECK (status IN ('backlog', 'playing', 'completed', 'dropped')),
  playtime_total NUMERIC(6, 1) NOT NULL DEFAULT 0 CHECK (playtime_total >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ratings (
  id BIGSERIAL PRIMARY KEY,
  game_id BIGINT NOT NULL UNIQUE REFERENCES games(id) ON DELETE CASCADE,
  gameplay NUMERIC(3, 1) CHECK (gameplay BETWEEN 0 AND 10),
  level_design NUMERIC(3, 1) CHECK (level_design BETWEEN 0 AND 10),
  story NUMERIC(3, 1) CHECK (story BETWEEN 0 AND 10),
  atmosphere NUMERIC(3, 1) CHECK (atmosphere BETWEEN 0 AND 10),
  replayability NUMERIC(3, 1) CHECK (replayability BETWEEN 0 AND 10),
  overall_score NUMERIC(3, 1) CHECK (overall_score BETWEEN 0 AND 10),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS playthroughs (
  id BIGSERIAL PRIMARY KEY,
  game_id BIGINT NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  playtime_hours NUMERIC(6, 1) NOT NULL DEFAULT 0 CHECK (playtime_hours >= 0),
  status TEXT NOT NULL CHECK (status IN ('Completed', 'In Progress', 'Dropped')),
  notes TEXT,
  difficulty TEXT,
  achievements_completed INTEGER CHECK (achievements_completed IS NULL OR achievements_completed >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT playthrough_dates_order CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date)
);

CREATE TABLE IF NOT EXISTS tags (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS game_tags (
  game_id BIGINT NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  tag_id BIGINT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (game_id, tag_id)
);

CREATE INDEX IF NOT EXISTS idx_games_title ON games(title);
CREATE INDEX IF NOT EXISTS idx_games_status ON games(status);
CREATE INDEX IF NOT EXISTS idx_playthroughs_game_id ON playthroughs(game_id);
CREATE INDEX IF NOT EXISTS idx_playthroughs_status ON playthroughs(status);
CREATE INDEX IF NOT EXISTS idx_game_tags_tag_id ON game_tags(tag_id);

CREATE OR REPLACE FUNCTION refresh_game_playtime_total(target_game_id BIGINT)
RETURNS VOID AS $$
BEGIN
  UPDATE games
  SET playtime_total = COALESCE((
    SELECT SUM(playtime_hours)
    FROM playthroughs
    WHERE game_id = target_game_id
  ), 0)
  WHERE id = target_game_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sync_game_playtime_total()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM refresh_game_playtime_total(OLD.game_id);
    RETURN OLD;
  END IF;

  PERFORM refresh_game_playtime_total(NEW.game_id);

  IF TG_OP = 'UPDATE' AND OLD.game_id <> NEW.game_id THEN
    PERFORM refresh_game_playtime_total(OLD.game_id);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_games_set_updated_at ON games;
CREATE TRIGGER trg_games_set_updated_at
BEFORE UPDATE ON games
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_ratings_set_updated_at ON ratings;
CREATE TRIGGER trg_ratings_set_updated_at
BEFORE UPDATE ON ratings
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_playthroughs_set_updated_at ON playthroughs;
CREATE TRIGGER trg_playthroughs_set_updated_at
BEFORE UPDATE ON playthroughs
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_playthroughs_sync_game_playtime_total ON playthroughs;
CREATE TRIGGER trg_playthroughs_sync_game_playtime_total
AFTER INSERT OR UPDATE OR DELETE ON playthroughs
FOR EACH ROW
EXECUTE FUNCTION sync_game_playtime_total();

