'use strict';

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	email: { type: String, required: true, index: { unique: true } },
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	password: { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);