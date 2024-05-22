import { AccessLevel, PrismaClient } from '@prisma/client';
import { readFile } from 'fs/promises';
import { PathLike } from 'node:fs';
import { EnumLike, util } from 'zod';

/**
 * @testonly
 * forked from https://github.com/prisma/prisma/discussions/2528
 * Quebra uma query de algum arquivo .sql e divide em statements para ser usado pelo Prisma#$executeRawUsafe
 */
function splitSqlStatements(rawSql: string) {
  const sqlReducedToStatements = rawSql
    .split('\n')
    .filter((line) => !line.startsWith('--')) // remove comments-only lines
    .join('\n')
    .replace(/\r\n|\n|\r/g, ' ') // remove newlines
    .replace(/\s+/g, ' '); // excess white space
  return splitStringByNotQuotedSemicolon(sqlReducedToStatements);
}
function splitStringByNotQuotedSemicolon(input: string): string[] {
  const result: string[] = [];

  let currentSplitIndex = 0;
  let isInString = false;
  for (let i = 0; i < input.length; i++) {
    if (input[i] === "'") {
      // toggle isInString
      isInString = !isInString;
    }
    if (input[i] === ';' && !isInString) {
      result.push(input.substring(currentSplitIndex, i + 1));
      currentSplitIndex = i + 2;
    }
  }

  return result;
}

export function randomEnumValue<T extends EnumLike>(
  enumObject: T,
): T[keyof T] | undefined {
  const enumValues = util.getValidEnumValues(enumObject);

  if (!enumValues.length) return undefined;

  return enumValues[Math.floor(Math.random() * enumValues.length)];
}

export async function executePrismaQueryBySql(
  prisma: PrismaClient,
  sqlScriptPath: PathLike,
) {
  const sql = await readFile(sqlScriptPath, { encoding: 'utf-8' });
  const queries = splitSqlStatements(sql);
  try {
    const promises = queries.map((q) => prisma.$executeRawUnsafe(q));
    const results = await Promise.allSettled(promises);
    const resolved = results.filter((r) => r.status === 'fulfilled');
    console.log(`Executed successfully ${resolved.length} raw queries.`);
    console.warn(
      `Ignoring ${results.length - resolved.length} failed raw queries.`,
    );
  } catch (error) {
    console.error('Error during test setup', error);
  }
}

export async function getTestSessionData(
  prisma: PrismaClient,
  accessLevel: AccessLevel = AccessLevel.User,
) {
  const user = await prisma.user.findFirstOrThrow({
    where: { accessLevel },
  });
  const session = await prisma.session.create({
    data: {
      userId: user.id,
      ip: 'localhost',
      createdAt: new Date().toISOString(),
    },
  });
  return {
    userId: user.id,
    sessionId: session.id,
  };
}
