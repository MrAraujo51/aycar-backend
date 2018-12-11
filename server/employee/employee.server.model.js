/*
 * @author: Manuel Araujo <alejandromanuel5187@gmail.com>
 * Created on 2017-10-14 10:20:44 
 */

const mongoose = require('mongoose'); // Node Tool for MongoDB
const Schema = mongoose.Schema; // Import Schema from Mongoose

const employeeSchema = new Schema({
    name: { type: String, required: true },
    whours: String,
    Section: {type: Schema.Types.ObjectId, ref: 'Section'}
})

const Employee = module.exports = mongoose.model('Employee', employeeSchema);