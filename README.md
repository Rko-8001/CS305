# CS305-Online Coding Platform

Assuing You are running the application on Linux(Ubuntu)

First install docker desktop (Take documentation as reference)

pull two images using command:

-> docker pull gcc 

-> docker pull openjdk



First Start the back-end by running the Backend

First navigate to the main server.js file using the following commands:

-> cd server
-> npm install
-> cd src

Now Start the server with the command:

-> node server.js


Starting the Front-end:

From the root of the directory navigate to the client part

-> cd client

-> npm install

(To install all the necessary packages)

-> npm start




How to test Backend:

navigate to server from the root of our directory

-> cd server

-> npm run test

For generating the coverage report run:

-> npm run coverage

After running
