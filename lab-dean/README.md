# 16 Basic Auth

## Installation
To install this app fork then clone the repo down to your own machine. Navigate to the directory named ```lab-dean``` and type ```npm install``` to get all of the NPM packages needed for the app. It is recommended to download either ```HTTPie``` or ```Postman``` to run the functions of the app, along with ```MongoDB```.

## Functionality
To get started first create a user by typing something like this into your command line:

```http POST http://localhost:3000/api/v1/signup username=tim password=dog email='tim@tim.com'```

This is using the POST HTTP method to create a new user object, with a safely encrypted password for user verification. 

If you want to sign in using the user object you created, type something like this into the command line:

```http -a tim:dog :3000/api/v1/signin```

## Tests

The tests are checking for valid routing and for valid authentication/authorizartion while routing. The following routes are tested: 

POST:

* 201 - valid request
* 401 - bad token
* 404 - not found
GET:

* 200 - valid request get all
* 200 - valid request get one
* 401 - bad token
* 404 - not found
PUT:

* 204 - valid request
* 400 - bad request
* 401 - bad token
* 404 - not found
DELETE:

* 204 - valid request
* 401 - bad token
* 404 - not found