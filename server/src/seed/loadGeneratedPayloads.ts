import { readFile } from 'node:fs/promises'
import path from 'node:path'
import type { DryRunIssue, GeneratedPayloadSummary, GeneratedSeedPayloads, LoadedGeneratedPayloads } from './seedTypes.js'

const defaultGeneratedDir = path.join(process.cwd(), '.generated', 'import-dry-run')

async function readJson<T>(filePath: string): Promise<T> {
  try {
    return JSON.parse(await readFile(filePath, 'utf8')) as T
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new Error(`Missing generated import dry-run artifact: ${filePath}. Run npm run import:dry-run first.`)
    }
    throw new Error(`Failed to read generated import dry-run artifact: ${filePath}. ${(error as Error).message}`)
  }
}

export async function loadGeneratedPayloads(generatedDir = defaultGeneratedDir): Promise<LoadedGeneratedPayloads> {
  const payloadsPath = path.join(generatedDir, 'payloads.json')
  const summaryPath = path.join(generatedDir, 'payload-summary.json')
  const issuesPath = path.join(generatedDir, 'issues.json')

  const [payloads, summary, issues] = await Promise.all([
    readJson<GeneratedSeedPayloads>(payloadsPath),
    readJson<GeneratedPayloadSummary>(summaryPath),
    readJson<DryRunIssue[]>(issuesPath),
  ])

  return { payloads, summary, issues }
}
