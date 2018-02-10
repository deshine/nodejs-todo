# Node To Do

To Do or Not To Do? A simple API for a ToDo app written in Node.js.

## Getting Started

Clone to your computer. Run 'npm install' from project root to download dependencies. Modify config_sample.js and rename to config.js. From project root, run 'npm start' to start the node server. Access API at http://localhost:3000/

### Prerequisites

Node.js, MongoDB

### Authorization

All endpoints except root require a token to be sent in header as 'Authorization: Bearer secretToken'

# API

## Users

* List of users
    * GET /users
* Get info of one user:
    * GET /users/{email}
* Create a user
    * POST /users
    	* email
    	* firstName
		* lastName
		* password
* Edit a user
    * PUT /users/{email}
    	* email
    	* firstName
		* lastName
		* password
* Delete a user
	* DELETE /users/{email}


## Projects

* List of projects of user
    * GET /projects/{email}

* Get project info of single project:
    * GET /projects/{email}/{name}

* Create a project
    * POST /projects/{email}
        * email (automatically set)
    	* name

* Edit a project
    * PUT /projects/{email}/{name}
    	* email
    	* name

* Delete a project
	* DELETE /projects/{email}/{name}


## Tasks

* List of all tasks of user - optional filters set as query parameters for priority, dueDate, and beforeDue
    * GET /tasks/{email}
    * GET /tasks/{email}?priority=1 - lists all tasks from all projects with priority 1
    * GET /tasks/{email}?dueDate=03-21-2018 - lists all tasks due on 03-21-2018
    * GET /tasks/{email}?dueDate=03-21-2018&beforeDue=1 - lists all tasks due on or before 03-21-2018

* List of all project - optional filters set as query parameters for priority, dueDate, and beforeDue
    * GET /tasks/{email}/{name}
    * GET /tasks/{email}/{name}?dueDate=03-21-2018 - lists all tasks due on 03-21-2018
    * GET /tasks/{email}/{name}?dueDate=03-21-2018&beforeDue=1 - lists all tasks due on or before 03-21-2018

* Get task info of single task
    * GET /tasks/{email}/{name}/{priority}

* Create a task:
    * POST /tasks/{email}/{name}
    	* email (automatically set)
    	* name (automatically set)
    	* summary
    	* description
    	* dueDate
    	* priority (automatically set to lowest priority)

* Edit a project - if priority is updated, other task priorities within project will be shifted accordingly
    * PUT /tasks/{email}/{name}/{priority}
    	* email 
    	* name
    	* summary
    	* description
    	* dueDate
    	* priority

* Delete a task - all tasks with lower priority will be moved up
	* DELETE /tasks/{email}/{name}/{priority}

## Built With

* [Node.js](https://nodejs.org)
* [MongoDB](https://www.mongodb.com/)
* [Hapijs](https://hapijs.com/)


## License

This project is licensed under the MIT License
