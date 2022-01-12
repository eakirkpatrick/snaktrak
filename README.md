# SnakTrak Website

Project Description: An application which allows college students to easily split and manage the cost of food among roommates. It will automatically split prices based on metrics specified by the user such as how many people live in the home, how much a given product costs, and the quantity of a product.

Overview of application architecture:
Our front end is a combination of HTML, CSS, and Javascript while utilizing Bootstrap. For the middle-end we use Node.js to interact with both our frontend and backend. Finally for the backend we use SQL to insert and grab data from our database.

https://snaktrak.herokuapp.com/

Repo Structure:
- We have all the code for the application within the Project Code folder. Inside of this folder we have a NodeJS structure to our application. You will find all the EJS templates and html files within views. There is also a folder called app which contains all the CSS stylesheets, javascript, and resources such as images. There is a folder init_data that contains the create.sql file. Finally, in the main directory we have a file called server.js, which acts as the main file utilizing NodeJS for routing and database logic.

How to Build and Run Code:
- Firstly, ensure that docker (https://docs.docker.com/engine/install/) and docker-compose (https://docs.docker.com/compose/install/) are installed on your machine
- Then clone the repository using `git clone https://github.com/eakirkpatrick/snaktrak.git`

- To run this application, simply run the command `docker-compose up -d` from inside the snaktrak/Project Code folder (in your command-line/terminal)  - You can open the application in the browser by navigating to `localhost:3000` in your browser of choice
- You can shut down the application using:
  `docker-compose down`
- To test the application, see test_cases.txt within the Project Code Folder
