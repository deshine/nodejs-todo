'use strict';

const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
	ownerEmail: { type: String, required: true },
	projectName: { type: String, required: true },
	summary: { type: String, required: true },
	description: { type: String },
	dueDate: { type: Date },
	priority: { type: Number }
});

module.exports = mongoose.model('Task', taskSchema);