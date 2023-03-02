### __Setting up virtual environment__

Make sure you begin in the correct folder:

`cd interview-visualization`

Create virtual environment:

`python3 -m venv venv`

Activate virtual environment:

`source venv/bin/activate`

Add `venv` to your .gitignore file if not already added

### __Install python libraries__

If the working regraph folder is already installed, delete line 2 of requirements.txt. Run this command:

`pip3 install -r requirements.txt`

If you had to download the regraph library using the command above, delete the folders `venv/lib/python3.10/site-packages/`... `neo4j`, `regraph/neo4j`, `regraph/backends/neo4j`, and `regraph/networkx`. 

You may also need to comment out lines 6 and 7 of `regraph/__init__.py`. This will comment out calls to neo4j.

### __Setting up flask API___

Create a new file in the backend folder named `.flaskenv`. Paste the following line in this file and save:

`FLASK_APP=content_authoring_backend.py`

Add `.flaskenv` to .gitignore file if not already added.

### __Running API__

A command has been added to `package.json` to allow the following command to start the backend:

`npm run start-backend`

The API is running on localhost:5000. The front-end fetches data from the API in `APIService.js`