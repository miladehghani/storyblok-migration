import { Command } from "commander";

import { generateMigration } from "./migration-generate.mjs";
import { runMigration } from "./migration-run.mjs";

const program = new Command();

// Define the main command
program
  .name("sb-migration")
  .description("A CLI tool to run blok migrations on Storyblok")
  .version("1.0.0");
program
  .command("generate")
  .description("Generate a new storyblok migration")
  .option("-o, --oAuthToken <type>", "Storyblok OAuth token")
  .option("-s, --space <type>", "Storyblok space ID to run the migration on")
  .option("-c, --component <type>", "Original component technical name")
  .option(
    "-i, --id <type>",
    "[Optional] Unique identifier for this migration [default = timestamp]"
  )
  .action(async (options) => {
    generateMigration(options);
  });

program
  .command("run")
  .description("Generate a new storyblok migration")
  .option("-m, --migrationFile <type>", "Which migration do you want to run?")
  .option("-s, --space <type>", "Storyblok space ID to run the migration on")
  .option("-d, --dryrun", "[default = true] Run the migration in dryrun mode")
  .action(async (options) => {
    runMigration(options);
  });

program.parse(process.argv);
