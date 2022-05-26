# NoteTogether API

## Setup
Please refer to [this document](https://github.com/shotnothing/NoteTogether/blob/dev/server/README.md) for how to run nodemon.

## The User routes
The user routes will handle user authentication, including registrations and logins. A user must obtain an authentication token via login in order to use majority of the application's functionality.

### Attributes
- ```username```: username of the user <br>
- ```email```: email address of the user <br>
- ```password```: password for logging into the application <br>
- ```notes```: an array of IDs of notes belonging to the user <br>
- ```tokens```: an array of tokens used for user authentication <br>

## ```POST``` Register a user
```
http://localhost:4000/user/register
```
### Body ```urlencoded```
- ```username``` <br>
- ```email``` <br>
- ```password``` <br>

### Example
```
var urlencoded = new URLSearchParams();
urlencoded.append("username", "Raffles");
urlencoded.append("email", "raffles@ewl.com");
urlencoded.append("password", "rpraffles");

var requestOptions = {
  method: 'POST',
  body: urlencoded,
  redirect: 'follow'
};

fetch("http://localhost:4000/user/register", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
```

### Response
```
{
    "data": {
        "notes": [],
        "_id": "628f251409f6aa163eefe404",
        "username": "Raffles",
        "email": "raffles@ewl.com",
        "password": "$2b$08$VZ5KPg/9Ja6Y5n2dEPd6leO4VVRvkuuyh3DhBEBNwqUnPqfTTibve",
        "tokens": [
            {
                "_id": "628f251409f6aa163eefe406",
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjhmMjUxNDA5ZjZhYTE2M2VlZmU0MDQiLCJ1c2VybmFtZSI6IlJhZmZsZXMiLCJlbWFpbCI6InJhZmZsZXNAZXdsLmNvbSIsImlhdCI6MTY1MzU0ODMwOCwiZXhwIjoxNjUzNTUxOTA4fQ.orIJxdTSQcisuvXZLh3CReLklY0rfX4qXaDgEwYTV4U"
            }
        ],
        "__v": 1
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjhmMjUxNDA5ZjZhYTE2M2VlZmU0MDQiLCJ1c2VybmFtZSI6IlJhZmZsZXMiLCJlbWFpbCI6InJhZmZsZXNAZXdsLmNvbSIsImlhdCI6MTY1MzU0ODMwOCwiZXhwIjoxNjUzNTUxOTA4fQ.orIJxdTSQcisuvXZLh3CReLklY0rfX4qXaDgEwYTV4U"
}
```

## ```POST``` Log in a user
```
http://localhost:4000/user/login
```
### Body ```urlencoded```
- ```email``` <br>
- ```password``` <br><br>

### Example
```
var urlencoded = new URLSearchParams();
urlencoded.append("email", "aljunied@ewl.com");
urlencoded.append("password", "alaljunied");

var requestOptions = {
  method: 'POST',
  body: urlencoded,
  redirect: 'follow'
};

fetch("http://localhost:4000/user/login", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
```

### Response
```
{
    "user": {
        "notes": [
            "628e003738ea124924ae2607"
        ],
        "_id": "628dfa2d96a4b53cbd169fb5",
        "username": "Aljunied",
        "email": "aljunied@ewl.com",
        "password": "$2b$08$wO1vCrR/TIk528GZiYvUoePnED2wq9dPfPLukRWVLMoz0yqhZ91dq",
        "tokens": [
            {
                "_id": "628dfa2e96a4b53cbd169fb7",
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjhkZmEyZDk2YTRiNTNjYmQxNjlmYjUiLCJ1c2VybmFtZSI6IkFsanVuaWVkIiwiZW1haWwiOiJhbGp1bmllZEBld2wuY29tIiwiaWF0IjoxNjUzNDcxNzkwLCJleHAiOjE2NTM0NzUzOTB9.icw3ik73_TrAMz_977dqq3z9ThG87BtM4JHzaZ6k_40"
            }
        ],
        "__v": 1
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjhkZmEyZDk2YTRiNTNjYmQxNjlmYjUiLCJ1c2VybmFtZSI6IkFsanVuaWVkIiwiZW1haWwiOiJhbGp1bmllZEBld2wuY29tIiwiaWF0IjoxNjUzNTQ4NjkzLCJleHAiOjE2NTM1NTIyOTN9.u_qVFhwwxZvK-luq7EZKGfG2JnPkuMeW09GMiYnURsQ"
}
```

## The Note routes
Notes in the application can be created, read, updated, deleted, published and searched. Users need authentication to access these APIs.

### Attributes
- ```title```: title given to the note document <br>
- ```content```: content of the note document <br>
- ```userId```: ID of the user who created the note <br><br>

## ```POST``` Create a note
```
http://localhost:4000/note/create
```
### Body ```urlencoded```
- ```title``` <br>
- ```content``` <br><br>

### Example
```
var urlencoded = new URLSearchParams();
urlencoded.append("title", "All Star");
urlencoded.append("content", "Somebody once told me the world is gonna roll me\nI ain't the sharpest tool in the shed\nShe was looking kind of dumb with her finger and her thumb\nIn the shape of an \"L\" on her forehead");

var requestOptions = {
  method: 'POST',
  body: urlencoded,
  redirect: 'follow'
};

fetch("http://localhost:4000/note/create", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
```

### Response
```
{
    "note": {
        "isPublished": false,
        "isDeleted": false,
        "_id": "628e002438ea124924ae25f4",
        "title": "All Star",
        "content": "Somebody once told me the world is gonna roll me\nI ain't the sharpest tool in the shed\nShe was looking kind of dumb with her finger and her thumb\nIn the shape of an \"L\" on her forehead",
        "userId": "628dfa2a96a4b53cbd169faf",
        "dateCreated": "2022-05-25T10:08:36.406Z",
        "dateLastUpdated": "2022-05-25T10:08:36.406Z",
        "__v": 0
    }
}
```

## ```GET``` Read a note
```
http://localhost:4000/note/read
```
### Body ```urlencoded```
- ```noteId```: ID of note to be read <br>

### Example
```
var urlencoded = new URLSearchParams();
urlencoded.append("noteId", "{{bkallstar}}");

var requestOptions = {
  method: 'GET',
  body: urlencoded,
  redirect: 'follow'
};

fetch("http://localhost:4000/note/read", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
```

### Response
```
{
    "title": "All Star",
    "content": "Somebody once told me the world is gonna roll me\nI ain't the sharpest tool in the shed\nShe was looking kind of dumb with her finger and her thumb\nIn the shape of an \"L\" on her forehead",
    "username": "Boon Keng"
}
```

## ```POST``` Update a note
```
http://localhost:4000/note/update
```
### Body ```urlencoded```
- ```noteId```: ID of the note to be updated <br>
- ```content```: new content of the note <br><br>

### Example
```
var urlencoded = new URLSearchParams();
urlencoded.append("noteId", "{{bkallstar}}");
urlencoded.append("content", "Somebody once asked could I spare some change for gas?\nI need to get myself away from this place\nI said, \"Yup\" what a concept\nI could use a little fuel myself\nAnd we could all use a little change");

var requestOptions = {
  method: 'POST',
  body: urlencoded,
  redirect: 'follow'
};

fetch("http://localhost:4000/note/update", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
```

### Response
```
{
    "note": {
        "isPublished": false,
        "isDeleted": false,
        "_id": "628e002438ea124924ae25f4",
        "title": "All Star",
        "content": "Somebody once asked could I spare some change for gas?\nI need to get myself away from this place\nI said, \"Yup\" what a concept\nI could use a little fuel myself\nAnd we could all use a little change",
        "userId": "628dfa2a96a4b53cbd169faf",
        "dateCreated": "2022-05-25T10:08:36.406Z",
        "dateLastUpdated": "2022-05-26T07:32:43.954Z",
        "__v": 0
    }
}
```

## ```POST``` Delete a note
```
http://localhost:4000/note/delete
```

### Body ```urlencoded```
- ```noteId```: ID of note to be deleted

### Example
```
var urlencoded = new URLSearchParams();
urlencoded.append("noteId", "{{bkallstar}}");

var requestOptions = {
  method: 'POST',
  body: urlencoded,
  redirect: 'follow'
};

fetch("http://localhost:4000/note/delete", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
```

### Response
```
{
    "note": {
        "isPublished": false,
        "isDeleted": true,
        "_id": "628e002438ea124924ae25f4",
        "title": "All Star",
        "content": "Somebody once asked could I spare some change for gas?\nI need to get myself away from this place\nI said, \"Yup\" what a concept\nI could use a little fuel myself\nAnd we could all use a little change",
        "userId": "628dfa2a96a4b53cbd169faf",
        "dateCreated": "2022-05-25T10:08:36.406Z",
        "dateLastUpdated": "2022-05-26T07:32:43.954Z",
        "__v": 0
    }
}
```

## ```POST``` Publish a note
```
http://localhost:4000/note/publish
```

### Body ```urlencoded```
- ```noteId```: ID of note to be published

### Example
```
var urlencoded = new URLSearchParams();
urlencoded.append("noteId", "{{bkgenerics}}");

var requestOptions = {
  method: 'POST',
  body: urlencoded,
  redirect: 'follow'
};

fetch("http://localhost:4000/note/publish", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
```

### Response
```
{
    "note": {
        "isPublished": true,
        "isDeleted": false,
        "_id": "628dffda7bb084463f07818b",
        "title": "BK Generics",
        "content": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna.",
        "userId": "628dfa2a96a4b53cbd169faf",
        "dateCreated": "2022-05-25T10:07:22.985Z",
        "dateLastUpdated": "2022-05-25T10:07:22.985Z",
        "__v": 0,
        "datePublished": "2022-05-25T10:08:52.201Z"
    }
}
```

## ```GET``` Search for a note
```
http://localhost:4000/note/search
```

### Body ```urlencoded```
- ```searchTerm```: search parameter for a case-insensitive regex search on all published titles

### Example
```
var urlencoded = new URLSearchParams();
urlencoded.append("searchTerm", "Generic");
urlencoded.append("page", "1");

var requestOptions = {
  method: 'GET',
  body: urlencoded,
  redirect: 'follow'
};

fetch("http://localhost:4000/note/search", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
```

### Response
Responses are sorted by recency.
```
{
    "searchResults": [
        {
            "_id": "628dffd07bb084463f07817c",
            "title": "HS Generics",
            "userId": {
                "_id": "628dfa1d96a4b53cbd169fa9",
                "username": "Hong Shan"
            },
            "datePublished": "2022-05-25T10:09:00.302Z"
        },
        {
            "_id": "628dffd77bb084463f078186",
            "title": "Generic Types",
            "userId": {
                "_id": "628dfa2d96a4b53cbd169fb5",
                "username": "Aljunied"
            },
            "datePublished": "2022-05-25T10:08:55.515Z"
        }
    ]
}
```
