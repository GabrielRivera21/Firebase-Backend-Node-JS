### Requirements

For this project you need Node JS version >= 4.2.4 with npm. You can download the installer
[here](https://nodejs.org/en/)

#### Installing Dependencies

To set up the project open up the command line and go into the where the `package.json` file
is and run the following to install the dependencies:

```
$ npm install
```

#### Virtual Environment

This project uses environmental variables and is able to read them from a `config.json` file,
so lets set that up. Execute the following command in the root directory of the project.

```
$ cp ./config/files/config-example.json ./config/files/config.json
```

Afterwards set your values for the database and azure storage connection inside the `config.json`.

#### Add Firebase Credentials

In order for the Firebase Admin SDK to work, you will need to follow the steps in
the documentation [here](https://firebase.google.com/docs/admin/setup#add_firebase_to_your_app)
to add the `serviceAccount.json` file under the `/config/files` directory

**Note**: You must name your private key file `serviceAccount.json`

#### Add Firebase to the Frontend

Paste initialization snippet into `views/html/messaging.html` with the one generated from
the Firebase Console **Overview > Add Firebase to your web app**.
See TODO in`views/html/messaging.html`.

#### Running the Project

To run the project on the directory go into the directory where the `package.json` file is in the
command line and run the following:

```
$ npm start
```

Enjoy!
