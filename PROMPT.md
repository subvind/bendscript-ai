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

```

### ./openai.js

```js

// Load environment variables
import { config } from 'dotenv';
config();

// Import necessary modules
import OpenAI from 'openai';

// Initialize OpenAI instance with API key
console.log('process.env.OPENAI_API_KEY',process.env.OPENAI_API_KEY)
const openai = new OpenAI(process.env.OPENAI_API_KEY);

// Function to interact with OpenAI's GPT-3 model
export async function createChatCompletion(prompt) {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' }, 
        { role: 'user', content: prompt }
      ]
    });

    return completion.data;
  } catch (error) {
    throw new Error('Error completing prompt with OpenAI:', error);
  }
}

```

### ./tests/hello-world.bs

```bs
(function () {
  /*intrabend test(return hello world)[*/
   // todo
  /*[*/
})()
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
```bs
/*intrabend welcome(log hello world)[*/
 // todo
/*[*/
```

#### terminal
```bash
# run transpiler
intrabend -i ./example.bs -b welcome
```

#### ./example.bs
after:
```bs
/*intrabend welcome(log hello world)[*/
  console.log("hello world");
/*[*/
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
npm start -- -i ./tests/hello-world.bs -b test

> intrabend@1.0.0 start
> node cli.js -i ./tests/hello-world.bs -b test

process.env.OPENAI_API_KEY j8ferjk5nerf34jwbcao8743dnm
Method test not found in the input file.
```

### ./TODO.md

```md
after todo: i will update my code base with the submitted files and run
the program ... if there is an error then it will be placed within ./CURRENT_ERROR.md
otherwise assume i have updated my requirements.

durring todo: if there is an error within ./CURRENT_ERROR.md then help me solve that
otherwise don't worry about it and proceed with todo rules.

TODO RULES:
 1) return a ./cli.js file

```

