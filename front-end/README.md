# Interview Authoring Tool
## Interview Authoring Tool for Springer article HCI 2023. Read more: https://link.springer.com/chapter/10.1007/978-3-031-35129-7_30 

![image](https://user-images.githubusercontent.com/16523534/222416147-54c273ed-aaed-43aa-863b-b119b3fcea07.png)

## Usage 

### Installing dependencies 

1. Install ReGraph from https://github.com/Kappa-Dev/ReGraph
2. Install Node v18.2.0 https://nodejs.org/download/release/v18.2.0/
3. Install npm 8.9.0 https://www.npmjs.com/package/npm/v/8.9.0

### Running the app

1. Navigate to the directory where you have cloned the project via your terminal on a Windows or Mac PC.
3. Navigate to the folder titled <b>backend</b> via the terminal.
4. If regraph was successfully installed, the following should start the Flask application without errors.

```
python content_authoring_backend.py
```

5. The app will run locally, and the terminal should look like the following: 

![image](https://user-images.githubusercontent.com/16523534/222415570-b26fbd62-9a5b-47bb-921a-962dff312871.png)

6. In another terminal, navigate to the front-end directory.
7. For first-time users, enter the following command that installs all dependencies.

```
npm install
```
8. Once installed succesfully, start the application locally using the following: 

```
npm start

```

## Back End Functions 

Please see the document named 'backend-functions.pdf' in the 'back-end' directory for details on the graph rewrite back-end functions. 
