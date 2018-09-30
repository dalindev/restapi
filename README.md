# restapi


### Project structure 
```
restapi
│
├── app.js
├── package.json
├── config
│    ├── conf.json [local config file, should not git this]
│    └── database.js
├── public
│    ├── css
│    └── js
└── app
    ├── config
    │    └── passport
    │        └── passport.js
    ├── controllers
    │    ├── auth_controller.js
    │    └── v1_0
    │        └── messages_controller.js
    │── models
    │    ├── index.js
    │    ├── messages.js
    │    └── user.js
    │── routes
    │    ├── auth_routes.js
    │    └── v1_0
    │        └── messages_routes.js
    │── tools
    │    └── helper_methods.js
    └── views
         ├── body_html [folder]
         ├── body_js [folder]
         ├── header [folder]
         ├── pages [folder]
         └── index.ejs
```


## v1 API documentation

 **getMessages**
----
  Returns json data about received messages

* **URL**

  `/api/v1/messages?limit=2&order=ASC&offset=15`

* **Method:**

  `GET`
  
* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />

* **Error Response:**

  * **Code:** 404 NOT FOUND <br />
      ```json
        {     
            'meta': {
              'error': true,
              'code': 404,
              'msg': 'Error: Can not get Messages!',
            }, 
        }
    ```

<br />
* **Sample Response:**

  ```json
    {
        "meta": {
            "error": false,
            "code": 200,
            "total": 2,
            "applied_filter": {
                "limit": 2,
                "order": "ASC",
                "offset": 15
            },
            "msg": "ok"
        },
        "data": [
            {
                "id": 19,
                "user_id": 1,
                "content": "OK = \"</script><script>alert('W');</script>\"",
                "createdAt": "2018-09-30T00:38:23.000Z",
                "palindrome": null,
                "User": {
                    "first_name": "dalin",
                    "last_name": "huang"
                }
            },
            {
                "id": 22,
                "user_id": 1,
                "content": "abcba",
                "createdAt": "2018-09-30T01:38:03.000Z",
                "palindrome": true,
                "User": {
                    "first_name": "dalin",
                    "last_name": "huang"
                }
            }
        ]
    }
  ```





