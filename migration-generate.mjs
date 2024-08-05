import { exec } from "child_process";
import { program } from "commander";
import { writeFileSync } from "fs";
import inquirer from "inquirer";

import { getComponents } from "./components.mjs";

program
  .option("-o, --oAuthToken <type>", "Storyblok OAuth token")
  .option("-s, --space <type>", "Storyblok space ID to run the migration on")
  .option("-c, --component <type>", "Original component technical name")
  .option("-i, --id <type>", "[Optional] Unique identifier for this migration [default = timestamp]")
  .parse(process.argv);

const options = program.opts();

// Define questions for Inquirer.js
const questions = [
  {
    type: "input",
    name: "oAuthToken",
    message: "What is the Storyblok OAuth token?",
    when: () => !options.oAuthToken
  },
  {
    type: "input",
    name: "spaceId",
    message: "What is the Storyblok space ID to run the migration on?",
    when: () => !options.space
  },
  {
    type: "list",
    name: "component",
    message: "What is the original component technical name?",
    choices: answers => {
      const { space, oAuthToken } = { ...answers, ...options };

      return new Promise((r, e) =>
        getComponents(space, oAuthToken)
          .then(res => {
            if (!res.ok) return e(res.statusText);
            else return res.json();
          })
          .then(res => res.components.map(c => ({ name: c.display_name, value: c.name })))
          .then(r)
          .catch(e)
      );
    },
    filter: console.log,
    when: () => !options.component // Ask only if not provided as an argument
  },
  {
    type: "input",
    name: "id",
    message: "Please Provide a unique identifier for this migration? [default = timestamp]",
    when: () => !options.id
  }
];

// Use Inquirer.js to prompt the questions
inquirer.prompt(questions).then(async answers => {
  // Merge command-line options and answers from Inquirer
  const { component, id, space } = {
    ...options,
    ...answers
  };
  const _id = id || Date.now();
  const command = `npx storyblok generate-migration -c ${component} -f ${_id} --space ${space}`;

  const child = exec(command);
  //To bind the child process i/o to the parent process i/o
  process.stdin.pipe(child.stdin);
  child.stderr.pipe(process.stderr);
  child.stdout.pipe(process.stdout);

  child.on("exit", () => {
    const path = `./migrations/change_${component}_${_id}.js`;
    const placeHolderContent = `
    module.exports = function (block) {
      // Example to change a string to boolean
      // block.test = !!(block.test)
      
      // Example to transfer content from other field
      // block.test = block.other_field

      // Example to update blok technical name
      // block.component = "new_nme"
    };
    `;
    // Update migrate content with more details
    writeFileSync(path, placeHolderContent);
  });
});
