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