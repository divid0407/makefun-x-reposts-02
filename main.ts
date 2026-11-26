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

import { copyFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const SOURCE_FILE = 'POSTS.json';

function main(): void {
  const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
  const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

  mkdirSync(outputDir, { recursive: true });

  const source = join(botDir, SOURCE_FILE);
  const destination = join(outputDir, SOURCE_FILE);

  try {
    copyFileSync(source, destination);
  } catch (err) {
    console.error(`Failed to copy ${source} to ${destination}: ${(err as Error).message}`);
    process.exit(1);
  }
}

main();
