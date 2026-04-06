import fs from 'node:fs/promises'
import path from 'node:path'
import { Client } from 'pg'

const rootDir = process.cwd()
const scriptsDir = path.join(rootDir, 'scripts')
const envPath = path.join(rootDir, '.env')

const migrationFiles = [
  '001_create_profiles.sql',
  '002b_create_weather_data.sql',
  '002_create_crops.sql',
  '003_create_livestock.sql',
  '004_create_storage.sql',
  '005_create_farm_logs.sql',
  '006_create_recommendations.sql',
  '007_create_achievements.sql',
  '008_create_market_data.sql',
  '009_create_notifications.sql',
  '010_profile_trigger.sql',
  '011_calculation_functions.sql',
  '012_seed_mock_data.sql',
]

function parseEnvFile(content) {
  const env = {}

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim()

    if (!trimmed || trimmed.startsWith('#')) {
      continue
    }

    const separatorIndex = trimmed.indexOf('=')

    if (separatorIndex === -1) {
      continue
    }

    const key = trimmed.slice(0, separatorIndex).trim()
    let value = trimmed.slice(separatorIndex + 1).trim()

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    env[key] = value
  }

  return env
}

function makeSqlMoreRepeatable(sql) {
  let transformed = sql

  transformed = transformed.replace(
    /CREATE POLICY\s+"([^"]+)"\s+ON\s+([^\s]+)\s/gi,
    (_, policyName, tableName) =>
      `DROP POLICY IF EXISTS "${policyName}" ON ${tableName};\nCREATE POLICY "${policyName}" ON ${tableName} `,
  )

  transformed = transformed.replace(
    /CREATE TRIGGER\s+([^\s]+)\s+(BEFORE|AFTER|INSTEAD OF)\s+(.+?)\s+ON\s+([^\s]+)\s/gi,
    (_, triggerName, triggerTiming, triggerBody, tableName) =>
      `DROP TRIGGER IF EXISTS ${triggerName} ON ${tableName};\nCREATE TRIGGER ${triggerName} ${triggerTiming} ${triggerBody} ON ${tableName} `,
  )

  transformed = transformed.replace(/CREATE INDEX\s+(?!IF NOT EXISTS)/gi, 'CREATE INDEX IF NOT EXISTS ')

  transformed = transformed.replace(
    /INSERT INTO public\.achievement_definitions\s*\(([\s\S]*?)\)\s*VALUES\s*([\s\S]*?);/gi,
    (_, columns, values) =>
      `INSERT INTO public.achievement_definitions (${columns}) VALUES ${values} ON CONFLICT (name) DO NOTHING;`,
  )

  return transformed
}

async function main() {
  const envContent = await fs.readFile(envPath, 'utf8')
  const env = parseEnvFile(envContent)
  const rawConnectionString =
    env.POSTGRES_URL_NON_POOLING ?? env.POSTGRES_URL ?? env.POSTGRES_PRISMA_URL

  if (!rawConnectionString) {
    throw new Error('Missing POSTGRES_URL_NON_POOLING, POSTGRES_URL, or POSTGRES_PRISMA_URL in .env')
  }

  const connectionUrl = new URL(rawConnectionString)
  connectionUrl.searchParams.delete('sslmode')
  connectionUrl.searchParams.delete('supa')
  connectionUrl.searchParams.delete('pgbouncer')

  const client = new Client({
    connectionString: connectionUrl.toString(),
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  })

  await client.connect()

  try {
    console.log('Connected to database.')
    await client.query('CREATE EXTENSION IF NOT EXISTS pgcrypto;')

    for (const fileName of migrationFiles) {
      const filePath = path.join(scriptsDir, fileName)
      const rawSql = await fs.readFile(filePath, 'utf8')
      const sql = makeSqlMoreRepeatable(rawSql)

      console.log(`Applying ${fileName}...`)
      await client.query(sql)
    }

    console.log('Backfilling profiles and user_stats for existing auth users...')
    await client.query(`
      INSERT INTO public.profiles (id)
      SELECT users.id
      FROM auth.users AS users
      ON CONFLICT (id) DO NOTHING;
    `)

    await client.query(`
      INSERT INTO public.user_stats (id, total_points, current_tier)
      SELECT users.id, 0, 'bronze'
      FROM auth.users AS users
      ON CONFLICT (id) DO NOTHING;
    `)

    await client.query("NOTIFY pgrst, 'reload schema';")
    console.log('Schema applied successfully and PostgREST reload requested.')
  } finally {
    await client.end()
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
