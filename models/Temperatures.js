import mongoose from "mongoose";


const temperatureSchema = new mongoose.Schema({
    _id: { type: Number, require: true},
    temperature: { type: Number, require: true},
}, { timestamps: true })

const Temperature = mongoose.model('Temperature', temperatureSchema, 'temperatures')

export default Temperature;

