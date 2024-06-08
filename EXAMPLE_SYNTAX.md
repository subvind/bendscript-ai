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