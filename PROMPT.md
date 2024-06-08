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

Durring prompt completion be sure to ask for only javascript like syntax output.
After prompt completion be sure to extract the raw code out from the markdown.
*/

```

### ./tests/hello-world.bs

```bs
(function () {
  /*test: say hello world*/
    console.log("")
  /*test*/
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

