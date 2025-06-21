import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: { type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    profileimg: { type: String, default: '' },
    last_log: {type: Date, required: true}
}, {timestamps: true}, {minimize: false})

const userModel = mongoose.models.users || mongoose.model("users", userSchema)

export default userModel