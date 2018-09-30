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

### NOTE: 
  * HTTP Status Codes will always be `200 OK`
  * However, the status code and error status can be found here:

        ```
            {     
                'meta': {
                  'error': true,
                  'code': 404,
                  'msg': 'Error: Can not get Messages!'
                } 
            }
        ```

 **getMessages [GET]**
----
  Returns json data about received messages

* **URL**

  `/api/v1/messages`

* **Method:**

  `GET`

* **Authentication:**

  None
  
* **Search Params**

  `?limit=2&order=ASC&offset=15`
  * limit (positive int) - max returned records
  * offset (positive int) - skip first xxx records
  * order (ASC or DESC)

* **Error Response:**

  * **HTTP Status Codes:** 200 <br />
    ```
        {     
            'meta': {
              'error': true,
              'code': 404,
              'msg': 'Error: Can not get Messages!'
            } 
        }
    ```

* **Success Response:**

  * **Code:** 200 <br />

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



 **getOneMessage [GET]**
----
  Returns json data about one message

* **URL**

  `/api/v1/messages/:id`

* **Method:**

  `GET`

* **Authentication:**

  None

* **URL Params**

  **Required:**
  `id=[integer]`

* **Error Response:**

  * **Code:** 404 NOT FOUND <br />
    ```
        {     
            'meta': {
              'error': true,
              'code': 404,
              'msg': 'Message dos not exsits'
            } 
        }
    ```

* **Success Response:**

  * **Code:** 200 <br />

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





