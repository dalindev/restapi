# restapi


### Project structure 

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


### API documentation
 