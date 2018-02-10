var Project = require('../models/project');

/**
 * List projects by user email
 */
exports.list = (req, h) => {

	return Project.find(req.params).exec().then((project) => {

		if (project.length < 1) {
			return { message: 'No projects added for this user yet' };
		}

		return { projects: project };
	}).catch((err) => {

		return { err: err };
	});
};


/**
 * Get project info by email and name
 */
exports.getUnique = (req, h) => {

	return Project.findOne(req.params).exec().then((project) => {

		if (!project) {
			return { message: 'Project not found' };
		}

		return { project: project };
	}).catch((err) => {

		return { err: err };

	});
};


/**
 * POST Create a project
 */
exports.create = (req, h) => {

	const projectData = {
		name: req.payload.name,
		ownerEmail: req.params.ownerEmail,
	};

	return Project.create(projectData).then((project) => {

		return { message: 'Project created successfully', project: project };
	}).catch((err) => {

		return { err: err };
	});
};


/**
 * PUT Update a project by user email and name
 */
exports.update = (req, h) => {

	const updatedProject = {
		name: ('name' in req.payload) ? req.payload.name : req.params.name,
		ownerEmail: ('ownerEmail' in req.payload) ? req.payload.ownerEmail : req.params.ownerEmail,
	};

	return Project.findOneAndUpdate(req.params, { $set: updatedProject }, { new: true }).exec().then((project) => {

		if (!project) {
			return { message: 'Project not found' };
		}

		return { message: 'Project data updated successfully', project: project };
	}).catch((err) => {

		return { err: err };
	});
};


/**
 * Delete a project by user email and name
 */
exports.remove = (req, h) => {

	return Project.findOneAndRemove(req.params).exec().then((project) => {

		if (!project) {
			return { message: 'Project not found' };
		}

		return { message: 'Project deleted successfully' };
	}).catch((err) => {

		return { err: err };
	});
};
