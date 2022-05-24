# NoteTogether Server
## Requirements
Install nodemon (if you have not)
```
npm install -g nodemon
```

Install packages
```
npm i express mongoose bcrypt jsonwebtoken nodemon morgan body-parser cors --save
```

## Setup
1. Create file \server\config\db.js
2. Add these lines to the newly created `db.js`
Replace <Addr of your DB> with yours.

```
module.exports = {
	database: "<Addr of your DB>",
	secret: "password"
};
```

### Start server
```
nodemon
```


