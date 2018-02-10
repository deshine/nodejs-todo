var Task = require('../models/task');

/**
 * List tasks by owner email and project name
 */
exports.list = (req, h) => {

	let search_param = req.params; // default parameters are /{email-required}/{projectName-optional}
	if ('priority' in req.query) {
		search_param.priority = req.query.priority; // if priority is sent as a get parameter add it to search filter
	}

	// if dueDate is sent as a get parameter add it to search filter
	if ('dueDate' in req.query) {
		
		// if beforeDue is set, get tasks before due date
		if ('beforeDue' in req.query && req.query.beforeDue == 1) {
			search_param.dueDate = { $lte: req.query.dueDate };
		} else {
			search_param.dueDate = req.query.dueDate;
		}
	}
	return Task.find(search_param).exec().then((task) => {

		if (task.length < 1) {
			return { message: 'No tasks added yet' };
		}

		return { tasks: task };
	}).catch((err) => {

		return { err: err };
	});
};


/**
 * Get task by owner email, project name, and priority
 */
exports.getUnique = (req, h) => {

	return Task.findOne(req.params).exec().then((task) => {

		if (!task) {
			return { message: 'Task not found' };
		}

		return { Task: task };
	}).catch((err) => {

		return { err: err };
	});
};


/**
 * POST Create a task for a project
 */
exports.create = (req, h) => {

	return Task.count(req.params).then((totalTasks) => {

		const taskData = {
			ownerEmail: req.params.ownerEmail,
			projectName: req.params.projectName,
			summary: req.payload.summary,
			description: req.payload.description,
			dueDate: req.payload.dueDate,
			priority: totalTasks
		};

		return Task.create(taskData).then((task) => {

			return { message: 'Task created successfully', task: task };
		}).catch((err) => {

			return { err: err };
		});

	}).catch((err) => {

		return { err: err };
	});
};


/**
 * PUT Update a task for a project
 */
exports.update = async (req, h) => {

	try {

		const projectParam = {
			ownerEmail: req.params.ownerEmail,
			projectName: req.params.projectName
		}
		const oldTask = await Task.findOne(req.params).exec();
		if (!oldTask) {
			return { message: 'Task not found' };
		} else {
			const totalTasks = await Task.count(projectParam);

			let updatedTask = {
				ownerEmail: ('ownerEmail' in req.payload) ? req.payload.ownerEmail : req.params.ownerEmail,
				projectName: ('projectName' in req.payload) ? req.payload.projectName : req.params.projectName
			}
			if ('summary' in req.payload) {
				updatedTask.summary = req.payload.summary;
			}
			if ('description' in req.payload) {
				updatedTask.description = req.payload.description;
			}
			if ('dueDate' in req.payload) {
				updatedTask.dueDate = req.payload.dueDate;
			}
			if ('priority' in req.payload) {
				const oldPriority = oldTask.priority;
				let newPriority = req.payload.priority;
				if (newPriority > totalTasks) {

					newPriority = totalTasks-1; // set new task priority to the lowest priority
					// if new priority is greater than total tasks, move all priorities lower up 1 and assign new priority to the last priority			
					let projectTasks = await Task.find(projectParam).where('priority').gt(oldPriority).sort('priority').exec();
					if (projectTasks.length) {
						for (let projectTask of projectTasks) {
							await Task.update( {_id: projectTask._id}, {priority: projectTask.priority-1} );
						}						
					}
				} else if (newPriority > oldPriority) {

					// if new priority is greater than old priority, shift task priorities up
					let projectTasks = await Task.find(projectParam).where('priority').gt(oldPriority).lte(newPriority).exec();
					for (let projectTask of projectTasks) {
						await Task.update( {_id: projectTask._id},{ priority: projectTask.priority-1});
					}
				} else if (newPriority < oldPriority) {

					// when new priority is less than old priority, shift task priorities down
					let projectTasks = await Task.find(projectParam).where('priority').lt(oldPriority).gte(newPriority).exec();					
					for (let projectTask of projectTasks) {
						await Task.update( {_id: projectTask._id},{ priority: projectTask.priority+1});
					}
				}

				updatedTask.priority = newPriority;
			}

			let newTask = await Task.findByIdAndUpdate({ _id: oldTask._id },{ $set: updatedTask }, { new: true }).exec();

			return { message: 'Task data updated successfully', task: newTask };

		}
	}
	catch (err) {

		return { err: err };
	}
};

/**
 * Delete a task by owner email, project name and priority
 */
exports.remove = async (req, h) => {

	try {

		const task = await Task.findOne(req.params).exec();
		if (!task) {
			return { message: 'Task not found' };
		} else { 

			const delTask = await Task.findByIdAndRemove({ _id: task._id }).exec();

			// shift task priorities that are lower than deleted task up 
			const projectParam = {
				ownerEmail: req.params.ownerEmail,
				projectName: req.params.projectName
			}
			let projectTasks = await Task.find(projectParam).where('priority').gt(task.priority).exec();
			if (projectTasks.length) {
				for (let projectTask of projectTasks) {
					await Task.update({ _id: projectTask._id }, { priority: projectTask.priority-1 });
				}
			}
			return { message: 'Task deleted successfully', task: delTask };
		}
	}
	catch (err) {

		return { err: err };
	}
};
