import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { Client } from 'pg';

function getSeedFilePath() {
  return path.resolve(__dirname, '..', '..', '..', 'database', 'seed', '001-local-seed.sql');
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required to run the local SQL seed.');
  }

  const seedFilePath = getSeedFilePath();
  const sql = await readFile(seedFilePath, 'utf8');
  const client = new Client({ connectionString: databaseUrl });

  await client.connect();

  try {
    await client.query(sql);

    const { rows } = await client.query(
      `
        SELECT title, status, playtime_total
        FROM games
        WHERE title LIKE '[seed] %'
        ORDER BY title ASC
      `,
    );

    console.log(`Local SQL seed applied from ${seedFilePath}`);
    console.table(rows);
  } finally {
    await client.end();
  }
}

void main().catch((error) => {
  console.error('Failed to apply local SQL seed.');
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});

