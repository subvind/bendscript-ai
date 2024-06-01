#!/usr/bin/env node

/*
is a node.js script that works with RUN_TESTS commands
so for example intrabend -i <fileName> -b <methodName> would be parsed

which would look in the file for syntax like that 
found in EXAMPLE_SYNTAX.md

for this hello world example:
- such that the name after intrabend is the methodName 
that means "test"
- such that everything between the () is to be prompted to ai
that means "return hello world"
- such that everything between the [] is to be replaced by output from ai
that means "// todo" would be replaced

be sure to use module syntax
be sure to use chatgpt when calling the ai
be sure to use dotenv for OPENAI_API_KEY
be sure to use AI_CALL.md for demo ai call
be sure to use yargs instead of minimist
be sure to use fs.readFile() when getting input
*/

// Import necessary modules
import fs from 'fs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { createChatCompletion } from './openai.js';

// Define the command-line options using yargs
const argv = yargs(hideBin(process.argv))
  .usage('Usage: $0 -i [input file] -b [method name]')
  .option('i', {
    alias: 'input',
    describe: 'Input file path',
    demandOption: true,
    type: 'string'
  })
  .option('b', {
    alias: 'method',
    describe: 'Method name',
    demandOption: true,
    type: 'string'
  })
  .argv;

// Read input file
fs.readFile(argv.input, 'utf8', async (err, data) => {
  if (err) {
    console.error('Error reading input file:', err);
    return;
  }

  // Parse input file to extract content to be prompted to AI
  const regex = new RegExp(`\\/\\*intrabend ${argv.method}\\(([^\\]]+)\\)\\[\\*\\/(.+)\\]\\[`, 's');
  const match = data.match(regex);

  if (!match) {
    console.error(`Method ${argv.method} not found in the input file.`);
    return;
  }

  const contentToPrompt = match[1].trim();

  // Call OpenAI's GPT-3 model
  try {
    const completion = await createChatCompletion(contentToPrompt);

    if (!completion || !completion.choices || completion.choices.length === 0) {
      console.error('Error completing prompt with OpenAI.');
      return;
    }

    const aiOutput = completion.choices[0].text.trim();

    // Replace placeholder in the input file with AI output
    const updatedData = data.replace(`// todo`, aiOutput);

    console.log(updatedData);
  } catch (error) {
    console.error('Error calling OpenAI:', error);
  }
});
