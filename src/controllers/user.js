const bcrypt = require('bcrypt');

var User = require('../models/user');

/**
 * List Users
 */
exports.list = (req, h) => {

	return User.find({}).exec().then((user) => {

		if (user.length < 1) {
			return { message: 'No users added yet' };	
		}

		return { users: user };
	}).catch((err) => {

		return { err: err };
	});
};


/**
 * Get User by email
 */
exports.getByEmail = (req, h) => {

	return User.findOne(req.params).exec().then((user) => {

		if (!user) {
			return { message: 'User not found' };
		}

		return { user: user };
	}).catch((err) => {

		return { err: err };
	});
};


/**
 * POST Create a user
 */
exports.create = async (req, h) => {

	let userData = {
		email: req.payload.email,
		firstName: req.payload.firstName,
		lastName: req.payload.lastName,
	};
	userData.password = await bcrypt.hash(req.payload.password,10)

	return User.create(userData).then((user) => {

		return { message: 'User created successfully', user: user };
	}).catch((err) => {

		return { err: err };
	});
};


/**
 * PUT Update a user by email
 */
exports.update = async (req, h) => {

	let updatedUser = {};
	if ('email' in req.payload) {
		updatedUser.email = req.payload.email;
	}
	if ('firstName' in req.payload) {
		updatedUser.firstName = req.payload.firstName;
	}
	if ('lastName' in req.payload) {
		updatedUser.lastName = req.payload.lastName;
	}
	if ('password' in req.payload) {
		updatedUser.password = await bcrypt.hash(req.payload.password,10);
	}

	return User.findOneAndUpdate(req.params,{ $set: updatedUser }, { new: true }).exec().then((user) => {

		if (!user) {
			return { message: 'User not found' };
		}

		return { message: 'User data updated successfully', user: user };
	}).catch((err) => {

		return { err: err };
	});
};


/**
 * Delete User by email
 */
exports.remove = (req, h) => {

	return User.findOneAndRemove(req.params).exec().then((user) => {

		if (!user) {
			return { message: 'User not found' };
		}

		return { message: 'User deleted successfully' };
	}).catch((err) => {

		return { err: err };
	});
};
