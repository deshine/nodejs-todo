'use strict';

const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
	name: { type: String, required: true },
	ownerEmail: { type: String, required: true },
});

projectSchema.index({ name: 1, ownerEmail: 1 }, { unique: true });

module.exports = mongoose.model('Project', projectSchema);