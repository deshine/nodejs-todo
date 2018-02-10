'use strict';

const Hapi = require('hapi');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const AuthBearer = require('hapi-auth-bearer-token');
const UserController =  require('./src/controllers/user');
const ProjectController =  require('./src/controllers/project');
const TaskController =  require('./src/controllers/task');
const config = require('./config');
const intro = require('./intro');

// connect to MongoDB
const MongoDBUrl = "mongodb://"+config.db_user+":"+config.db_password+"@"+config.db_host;

const server = new Hapi.Server({
	port: 3000,
	host: 'localhost'
});

(async () => {
	try {

		await server.register(AuthBearer)

		server.auth.strategy('simple', 'bearer-access-token', {
			// uncomment below line to allow access token to be passed as query parameter 'access_token'
			// allowQueryToken: true, 
			validate: async (request, token, h) => {

			// validate token here - for this example, use Authorization: Bearer secretToken
			const isValid = token === 'secretToken';

			const credentials = { token };
			const artifacts = { extra: 'info' };

			return { isValid, credentials, artifacts };
	        }
	    });

	    server.auth.default('simple');


		server.route({
			method: 'GET',
			path: '/',
			config: { auth: false },
			handler: function (request, h) {
				return intro;
			}
		});

		/**
		 * User Routes
		 */
		// get a list of users
		server.route({
			method: 'GET',
			path: '/users',
			handler: UserController.list
		});

		// get user info using email
		server.route({
			method: 'GET',
			path: '/users/{email}',
			handler: UserController.getByEmail
		});

		// create a new user
		server.route({
			method: 'POST',
			path: '/users',
			handler: UserController.create
		});

		// update user info using email
		server.route({
			method: 'PUT',
			path: '/users/{email}',
			handler: UserController.update
		});

		// delete user using email
		server.route({
			method: 'DELETE',
			path: '/users/{email}',
			handler: UserController.remove
		});

		/**
		 * Project Routes
		 */
		// get list of projects using owner email
		server.route({
			method: 'GET',
			path: '/projects/{ownerEmail}',
			handler: ProjectController.list
		});

		// get project info using owner email and name of project
		server.route({
			method: 'GET',
			path: '/projects/{ownerEmail}/{name}',
			handler: ProjectController.getUnique
		});

		// create a new project for user using owner email
		server.route({
			method: 'POST',
			path: '/projects/{ownerEmail}',
			handler: ProjectController.create
		});

		// update a project using owner email and project name
		server.route({
			method: 'PUT',
			path: '/projects/{ownerEmail}/{name}',
			handler: ProjectController.update
		});

		// delete project using owner email and project name
		server.route({
			method: 'DELETE',
			path: '/projects/{ownerEmail}/{name}',
			handler: ProjectController.remove
		});

		/**
		 * Task Routes
		 */
		// get list of tasks by owner email
		server.route({
			method: 'GET',
			path: '/tasks/{ownerEmail}',
			handler: TaskController.list
		});

		// get list of tasks by owner email and project name
		server.route({
			method: 'GET',
			path: '/tasks/{ownerEmail}/{projectName}',
			handler: TaskController.list
		});

		// get a task by owner email, project name, and priority
		server.route({
			method: 'GET',
			path: '/tasks/{ownerEmail}/{projectName}/{priority}',
			handler: TaskController.getUnique
		});

		// create a new task for a project
		server.route({
			method: 'POST',
			path: '/tasks/{ownerEmail}/{projectName}',
			handler: TaskController.create
		});

		// update a project using owner email and project name
		server.route({
			method: 'PUT',
			path: '/tasks/{ownerEmail}/{projectName}/{priority}',
			handler: TaskController.update
		});

		// delete project using owner email and project name
		server.route({
			method: 'DELETE',
			path: '/tasks/{ownerEmail}/{projectName}/{priority}',
			handler: TaskController.remove
		});

		await server.start();
		// Once started, connect to Mongo through Mongoose
		mongoose.connect(MongoDBUrl, {}).then(() => { console.log(`Connected to Mongo server`) }, err => { console.log(err) });
		console.log(`Server running at: ${server.info.uri}`);

	}
	catch (err) {  
		console.log(err)
	}
})();
