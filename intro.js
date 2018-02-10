const intro = {
	welcome: 'Hi, welcome to the ToDo API',
	authorization: 'use \'Authorization: Bearer secretToken\' in header',
	api_endpoints: {
		users: {
			GET: 'returns a list of all users',
			POST: 'creates a new user with properties of email, firstName, lastName, password',
			email: {
				GET: 'returns user info',
				PUT: 'updates a user',
				DELETE: 'deletes a user'
			}
		},
		projects: {
			email: {
				GET: 'get a list of all projects by owner',
				POST: 'create a new project for owner',
				name: {
					GET: 'get info of project',
					PUT: 'updates a project',
					DELETE: 'deletes a project'
				}

			}
		},
		tasks: {
			email: {
				GET: 'get a list of all tasks by owner, use query parameters \'priority\', \'dueDate\', and \'beforeDue\' to filter',
				name: {
					GET: 'get a list of all tasks in project, use query parameters \'priority\', \'dueDate\', and \'beforeDue\' to filter',
					POST: 'create a new task in project',
					priority: {
						GET: 'get task info',
						PUT: 'updates a task',
						DELETE: 'deletes a task'
					}
				}
			}
		}
	}
};

module.exports = intro;