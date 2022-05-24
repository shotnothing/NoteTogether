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
2. Add these lines
'''
module.exports = {
	database: "addr of your mongo db",
	secret: "password"
};

'''

### Start server
```
nodemon
```


