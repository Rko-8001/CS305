# CS305-Online Coding Platform

Assuming you are running the application on Linux(Ubuntu)

First install docker desktop (Take documentation as reference)

Pull two images using command:

```
docker pull gcc
docker pull openjdk
```

You might have to give user permission to docker

```
sudo usermod -aG docker $USER
```

sudo usermod -aG docker $USER


First Start the back-end by running the Backend:

First navigate to the main server.js file using the following commands:

```
cd server
npm install
cd src
```


Now Start the server with the command:

```
node server.js
```


Starting the Front-end:

From the root of the directory navigate to the client part

```
cd client
npm install
```


(To install all the necessary packages for the client part)

Now to start the application(front-end) run command:

```
npm start
```

This would start the application on local host.


How to test Backend:

navigate to server from the root of our directory

```
cd server
npm run test
```

For generating the coverage report run:

```
npm run coverage
```

After running these commands proper coverage reports will be generated.


In our website, Only one is superuser with Creds:

```
Email: 2020csb1102@iitrpr.ac.in
Password: "****"
```
