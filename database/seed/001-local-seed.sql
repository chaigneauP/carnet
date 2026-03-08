BEGIN;

DELETE FROM games
WHERE title IN (
  '[seed] Hollow Knight',
  '[seed] Returnal',
  '[seed] Resident Evil 2'
);

INSERT INTO tags (name)
VALUES
  ('metroidvania'),
  ('roguelike'),
  ('survival horror'),
  ('masterpiece'),
  ('challenging'),
  ('sci-fi'),
  ('favorite')
ON CONFLICT (name) DO NOTHING;

INSERT INTO games (
  title,
  developer,
  release_year,
  genre,
  cover_url,
  description,
  status
)
VALUES
  (
    '[seed] Hollow Knight',
    'Team Cherry',
    2017,
    'Metroidvania',
    NULL,
    'Jeu de test local pour vérifier l''API, Prisma et PostgreSQL.',
    'completed'
  ),
  (
    '[seed] Returnal',
    'Housemarque',
    2021,
    'Roguelike shooter',
    NULL,
    'Jeu de test local avec une partie encore en cours.',
    'playing'
  ),
  (
    '[seed] Resident Evil 2',
    'Capcom',
    2019,
    'Survival horror',
    NULL,
    'Jeu de test local terminé avec note et tags.',
    'completed'
  );

INSERT INTO ratings (
  game_id,
  gameplay,
  level_design,
  story,
  atmosphere,
  replayability,
  overall_score,
  notes
)
SELECT
  id,
  9.5,
  9.0,
  8.5,
  9.8,
  9.2,
  9.4,
  'Seed local: excellente exploration et ambiance.'
FROM games
WHERE title = '[seed] Hollow Knight'
ON CONFLICT (game_id) DO UPDATE SET
  gameplay = EXCLUDED.gameplay,
  level_design = EXCLUDED.level_design,
  story = EXCLUDED.story,
  atmosphere = EXCLUDED.atmosphere,
  replayability = EXCLUDED.replayability,
  overall_score = EXCLUDED.overall_score,
  notes = EXCLUDED.notes;

INSERT INTO ratings (
  game_id,
  gameplay,
  level_design,
  story,
  atmosphere,
  replayability,
  overall_score,
  notes
)
SELECT
  id,
  8.8,
  8.4,
  7.8,
  8.9,
  8.6,
  8.7,
  'Seed local: run en cours pour tester le statut playing.'
FROM games
WHERE title = '[seed] Returnal'
ON CONFLICT (game_id) DO UPDATE SET
  gameplay = EXCLUDED.gameplay,
  level_design = EXCLUDED.level_design,
  story = EXCLUDED.story,
  atmosphere = EXCLUDED.atmosphere,
  replayability = EXCLUDED.replayability,
  overall_score = EXCLUDED.overall_score,
  notes = EXCLUDED.notes;

INSERT INTO ratings (
  game_id,
  gameplay,
  level_design,
  story,
  atmosphere,
  replayability,
  overall_score,
  notes
)
SELECT
  id,
  8.9,
  8.6,
  8.7,
  9.1,
  7.9,
  8.8,
  'Seed local: remake solide pour valider les listes.'
FROM games
WHERE title = '[seed] Resident Evil 2'
ON CONFLICT (game_id) DO UPDATE SET
  gameplay = EXCLUDED.gameplay,
  level_design = EXCLUDED.level_design,
  story = EXCLUDED.story,
  atmosphere = EXCLUDED.atmosphere,
  replayability = EXCLUDED.replayability,
  overall_score = EXCLUDED.overall_score,
  notes = EXCLUDED.notes;

INSERT INTO playthroughs (
  game_id,
  platform,
  start_date,
  end_date,
  playtime_hours,
  status,
  notes,
  difficulty,
  achievements_completed
)
SELECT
  id,
  'PC',
  DATE '2024-01-10',
  DATE '2024-02-02',
  42.5,
  'Completed',
  'Seed local terminé pour tester les totaux.',
  'Normal',
  112
FROM games
WHERE title = '[seed] Hollow Knight';

INSERT INTO playthroughs (
  game_id,
  platform,
  start_date,
  end_date,
  playtime_hours,
  status,
  notes,
  difficulty,
  achievements_completed
)
SELECT
  id,
  'PS5',
  DATE '2024-11-05',
  NULL,
  18.0,
  'In Progress',
  'Seed local en cours pour vérifier le statut playing.',
  'Standard',
  8
FROM games
WHERE title = '[seed] Returnal';

INSERT INTO playthroughs (
  game_id,
  platform,
  start_date,
  end_date,
  playtime_hours,
  status,
  notes,
  difficulty,
  achievements_completed
)
SELECT
  id,
  'PS4',
  DATE '2023-10-03',
  DATE '2023-10-18',
  13.5,
  'Completed',
  'Seed local terminé pour exposer un second jeu complété.',
  'Normal',
  42
FROM games
WHERE title = '[seed] Resident Evil 2';

INSERT INTO game_tags (game_id, tag_id)
SELECT g.id, t.id
FROM games g
JOIN tags t ON t.name IN ('metroidvania', 'masterpiece', 'favorite')
WHERE g.title = '[seed] Hollow Knight'
ON CONFLICT (game_id, tag_id) DO NOTHING;

INSERT INTO game_tags (game_id, tag_id)
SELECT g.id, t.id
FROM games g
JOIN tags t ON t.name IN ('roguelike', 'challenging', 'sci-fi')
WHERE g.title = '[seed] Returnal'
ON CONFLICT (game_id, tag_id) DO NOTHING;

INSERT INTO game_tags (game_id, tag_id)
SELECT g.id, t.id
FROM games g
JOIN tags t ON t.name IN ('survival horror', 'favorite')
WHERE g.title = '[seed] Resident Evil 2'
ON CONFLICT (game_id, tag_id) DO NOTHING;

COMMIT;

