Please follow the instructions within ./TODO.md! Thank you :)
### ./cli.js

```js
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

when walking the file,
- look for 2 block comments; an opening and closing
- the 2 block comments should match based on methodName
- the text to replace should be everything between both block comments

Don't forget to account for the fact that there many be many block
comments in the file with many different method names.

When writing to the file don't forget to preserve spacing such that,
- if the first comment block has 2 spaces infront of it then indent the prompt output by 4 spaces total
- if it first comment block has no spaces then indent the prompt output by 2 spaces total

Leave comment blocks untouched when changing file.

When prompting the AI create a markdown text file with the following:
- a code comment with the original file in it
- another code comment with the original code that sits between the 2 block comments
- another code comment with a list of rules in it from RULES.md
- a final comment that contains the main prompt
*/

import fs from 'fs';
import path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import dotenv from 'dotenv';
import OpenAI from "openai";

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error('Error: OPENAI_API_KEY is not set in the environment variables.');
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY
});

async function runAI(prompt) {
  console.log('Running AI with prompt:', prompt);

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'system', content: 'You are a helpful assistant.' }, { role: 'user', content: prompt }],
    });

    const rawOutput = completion.choices[0].message.content;
    console.log('AI raw output:', rawOutput);
    return extractCodeFromMarkdown(rawOutput);
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return null;
  }
}

function extractCodeFromMarkdown(markdown) {
  const match = markdown.match(/```javascript[\s\S]*?```/);
  if (match) {
    return match[0].replace(/```javascript|```/g, '').trim();
  }
  return markdown.trim();
}

function generateMarkdownFile(fileName, originalFile, methodName, originalCode, rules, prompt) {
  let promptWrap = `Below is a file "${fileName}" with a method in it called "${methodName}".
Based on the below "RULES.md" I want you to follow the below "Prompt" and answer acordingly.
PLEASE RESPOND WITH A SOLUTION THAT FITS INSIDE THE ${methodName} CODE BLOCK BELOW!

### ${fileName}
\`\`\`
${originalFile}
\`\`\`

### ${methodName}
\`\`\`
${originalCode}
\`\`\`

### RULES.md
\`\`\`
${rules}
\`\`\`

### Prompt
${prompt}`;
  return promptWrap;
}

function processFile(fileName, methodName) {
  fs.readFile('./RULES.md', 'utf8', (err, rules) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }
    fs.readFile(fileName, 'utf8', async (err, data) => {
      if (err) {
        console.error('Error reading file:', err);
        return;
      }

      const regex = new RegExp(`(\\s*)\\/\\*${methodName}: (.*?)\\*\\/([\\s\\S]*?)\\/\\*${methodName}\\*\\/`, 'g');
      const matches = [...data.matchAll(regex)];
      
      if (matches.length === 0) {
        console.error('No matching blocks found for methodName:', methodName);
        return;
      }

      for (const match of matches) {
        const [fullMatch, indent, prompt, originalCode] = match;
        console.log('Found match:', fullMatch);
        console.log('Prompt:', prompt);
        console.log('Original code:', originalCode);

        let promptWrap = generateMarkdownFile(fileName, data, methodName, originalCode, rules, prompt);
        console.log('========');
        console.log(promptWrap);
        console.log('========');

        const aiResponse = await runAI(promptWrap);
        if (aiResponse) {
          const newIndent = '  '.repeat(indent.length - 1);
          const newCode = aiResponse.split('\n').map(line => newIndent + line).join('\n');
          const newContent = `${indent}/*${methodName}: ${prompt}*/\n${newCode}\n${indent}/*${methodName}*/`;
          data = data.replace(fullMatch, newContent);
        }
      }

      fs.writeFile(fileName, data, 'utf8', (err) => {
        if (err) {
          console.error('Error writing file:', err);
        } else {
          console.log('File updated successfully.');
        }
      });
    });
  });
}

const argv = yargs(hideBin(process.argv))
  .option('i', {
    alias: 'input',
    describe: 'Input file name',
    type: 'string',
    demandOption: true
  })
  .option('b', {
    alias: 'block',
    describe: 'Method name to look for in the file',
    type: 'string',
    demandOption: true
  })
  .argv;

processFile(argv.input, argv.block);
```

### ./tests/hello-world.bs

```bs
(function () {
  /*test: say hello world*/
    console.log("Hello World 😊😊😊");

  /*test*/
})()
```

### ./RULES.md

```md
1) return a single code fragment not the full file!
2) i'd like JavaScript code in response to my queries!
3) keep console.log statements for debugging!
```

### ./RUN_TESTS.md

```md
#### run tests local
```bash
# install
npm install

npm start -- -i ./tests/hello-world.bs -b test
```

#### run test packaged
```bash
# install global
npm install intrabend -g

intrabend -i ./tests/hello-world.bs -b test
```
```

### ./EXAMPLE_SYNTAX.md

```md
#### ./example.bs
before:
```ts
/*welcome: say hello world*/
  console.log("");
/*welcome*/
```

#### terminal
```bash
# run transpiler
intrabend -i ./example.bs -b welcome
```

#### ./example.bs
after:
```ts
/*welcome: say hello world*/
  console.log("hello world");
/*welcome*/
```
```

### ./AI_CALL.md

```md
```ts
import OpenAI from "openai";

const openai = new OpenAI();

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "You are a helpful assistant." }],
    model: "gpt-3.5-turbo",
  });

  console.log(completion.choices[0]);
}

main();
```
```

### ./CURRENT_ERROR.md

```md

```

### ./TODO.md

```md
after todo: i will update my code base with the submitted files and run
the program ... if there is an error then it will be placed within ./CURRENT_ERROR.md
otherwise assume i have updated my requirements.

durring todo: if there is an error within ./CURRENT_ERROR.md then help me solve that
otherwise don't worry about it and proceed with the following todo rules.

TODO RULES:
 1) return a ./cli.js file
 2) i'd like JavaScript code in response to my queries!
 3) keep console.log statements for debugging
```

