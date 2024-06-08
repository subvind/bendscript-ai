#!/usr/bin/env node

/*
is a node.js script that works with RUN_TESTS commands
so for example intrabend -i <fileName> -b <methodName> would be parsed

which would look in the file for syntax like that 
found in EXAMPLE_SYNTAX.md

for this hello world example:
- such that the name at the beginning is the methodName; which would be "welcome"...
- such that everything after the methodName and colon is the prompt; which would be "say hello world"...
- such that everything between the 2 comment blocks is the prompt output; which would be "  console.log("");"...

be sure to use module syntax
be sure to use chatgpt when calling the ai
be sure to use dotenv for OPENAI_API_KEY
be sure to use AI_CALL.md for demo ai call
be sure to use yargs instead of minimist
be sure to use fs.readFile() when getting input

when using acon walk,
- look for 2 block comments; an opening and closing
- the 2 block comments should match based on methodName
- the text to replace should be everything between both block comments

Don't forget to account for the fact that there many be many block
comments in the file with many different method names.
*/

import fs from 'fs';
import yargs from 'yargs';
import dotenv from 'dotenv';
import { hideBin } from 'yargs/helpers';
import OpenAI from 'openai';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function callAI(prompt) {
  const completion = await openai.chat.completions.create({
    messages: [{ role: 'system', content: 'You are a helpful assistant.' }, { role: 'user', content: prompt }],
    model: 'gpt-3.5-turbo',
  });

  return completion.choices[0].message.content;
}

const argv = yargs(hideBin(process.argv))
  .option('input', {
    alias: 'i',
    description: 'Input file name',
    type: 'string',
    demandOption: true,
  })
  .option('block', {
    alias: 'b',
    description: 'Block method name',
    type: 'string',
    demandOption: true,
  })
  .help()
  .alias('help', 'h')
  .argv;

fs.readFile(argv.input, 'utf8', async (err, data) => {
  if (err) {
    console.error(`Error reading file: ${err}`);
    return;
  }

  const methodName = argv.block;
  const regex = new RegExp(`\\/\\*${methodName}: (.*?)\\*\\/([\\s\\S]*?)\\/\\*${methodName}\\*\\/`, 'g');
  let match;
  let updatedData = data;

  while ((match = regex.exec(data)) !== null) {
    const prompt = match[1].trim();
    console.log(`Found block with prompt: "${prompt}"`);
    const aiResponse = await callAI(prompt);
    console.log(`AI response: "${aiResponse}"`);
    const newBlock = `/*${methodName}: ${prompt}*/\n${aiResponse}\n/*${methodName}*/`;
    updatedData = updatedData.replace(match[0], newBlock);
  }

  fs.writeFile(argv.input, updatedData, 'utf8', (err) => {
    if (err) {
      console.error(`Error writing file: ${err}`);
    } else {
      console.log(`File successfully updated: ${argv.input}`);
    }
  });
});