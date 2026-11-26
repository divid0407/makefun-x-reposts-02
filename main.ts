// makefun-x-reposts-02 entry (Node 22, standard library only).
//
// The entry is the X posts themselves: seven posts from one public X account,
// each quoting or replying to a different post of @makefunai, with make.fun
// (or @makefunai) and the entrant's play code in each post's own words.
// This program only hands their addresses to the gate: it copies POSTS.json
// from the bot directory into the output directory, where the gate reads it.
// Nothing this program writes about the posts is scored.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const SOURCE_FILE = 'POSTS.json';

// The gate reads POSTS.json from the output directory and rejects the entry
// if any listed post is unreadable, so fail loudly here instead of copying
// a malformed file through: the object must hold a non-empty "posts" array
// whose every entry is an https:// post address string.
function validatePostsJson(source: string): void {
  let raw: string;
  try {
    raw = readFileSync(source, 'utf8');
  } catch (err) {
    console.error(`Failed to read ${source}: ${(err as Error).message}`);
    process.exit(1);
  }

  let data: unknown;
  try {
    data = JSON.parse(raw!);
  } catch (err) {
    console.error(`Invalid JSON in ${source}: ${(err as Error).message}`);
    process.exit(1);
  }

  if (
    typeof data !== 'object' ||
    data === null ||
    !Array.isArray((data as { posts?: unknown }).posts) ||
    (data as { posts: unknown[] }).posts.length === 0 ||
    !(data as { posts: unknown[] }).posts.every(
      (entry) => typeof entry === 'string' && entry.startsWith('https://'),
    )
  ) {
    console.error(
      `Invalid ${source}: expected an object with a non-empty "posts" array of https:// URLs`,
    );
    process.exit(1);
  }
}

function main(): void {
  const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
  const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

  const source = join(botDir, SOURCE_FILE);
  const destination = join(outputDir, SOURCE_FILE);

  validatePostsJson(source);

  mkdirSync(outputDir, { recursive: true });

  try {
    copyFileSync(source, destination);
  } catch (err) {
    console.error(`Failed to copy ${source} to ${destination}: ${(err as Error).message}`);
    process.exit(1);
  }
}

main();
