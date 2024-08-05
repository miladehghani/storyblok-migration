import { exec } from "child_process";
import { existsSync, readdirSync } from "fs";
import inquirer from "inquirer";

export const runMigration = options => {
  const questions = [
    {
      type: "list",
      name: "migrationFile",
      message: "Which migration do you want to run?",
      when: () => !options.component, // Ask only if not provided as an argument
      choices: () => {
        if (!existsSync("./migrations")) throw Error("No migrations found please generate a migration first");

        return readdirSync("./migrations").map(file => ({
          name: file,
          value: file.replace(".js", "")
        }));
      }
    },
    {
      type: "input",
      name: "space",
      message: "What is the Storyblok space ID to run the migration on?",
      when: () => !options.space
    },
    {
      type: "confirm",
      name: "dryrun",
      message: "Do you want to run the migration in dryrun mode?",
      when: () => !options.dryrun,
      default: true
    }
  ];

  // Use Inquirer.js to prompt the questions
  inquirer
    .prompt(questions)
    .then(async answers => {
      // Merge command-line options and answers from Inquirer
      const { migrationFile, space, dryrun } = {
        ...options,
        ...answers
      };

      const splits = migrationFile.split("_");
      const c = splits.slice(1, splits.length - 1).join("_");
      const f = splits[splits.length - 1];

      const command = `npx storyblok run-migration -c ${c} -f ${f} --space ${space} ${dryrun ? "--dryrun" : ""}`;

      const child = exec(command);

      //To bind the child process i/o to the parent process i/o
      process.stdin.pipe(child.stdin);
      child.stderr.pipe(process.stderr);
      child.stdout.pipe(process.stdout);
    })
    .catch(console.error);
};
