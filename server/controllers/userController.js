import userModel from '../models/userModel.js'
import resumeModel from '../models/resumeModel.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import validator from 'validator'
import fs from 'fs'

const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET)
}

const registerUser = async(req, res) => {
    const newUser = req.body

    if (!validator.isEmail(newUser.email)) {
        console.log("Invalid Email")
        return res.json({
            success: false,
            message: "Invalid email"
        })
    }
    
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!^#%*?&])[A-Za-z\d@$!^#%*?&]{8,}$/
    if (!passwordPattern.test(newUser.password)){
        console.log("Invalid Password")
        return res.json({
            success: false,
            message: "Password must contain atleast 8 characters with atleast 1 Capital letter, small letter, digit and special character"
        })
    }

    const emailInUse = await userModel.findOne({ email: newUser.email })
    if (emailInUse) {
        console.log("Email already in use")
        return res.json({
            success: false,
            message: "Email is already in use"
        })
    }

    const hashedPassword = await bcrypt.hash(newUser.password, 10)

    try{
        const user = new userModel({
            name: newUser.name,
            email: newUser.email,
            password: hashedPassword,
            last_log: new Date()
        })
        const registeredUser = await user.save()
        const token = createToken(registeredUser._id)
        console.log("User registered successfully")
        return res.json({
            success: true,
            message: "User registered Successfully",
            data: registeredUser,
            token
        })
    } catch(error) {
        console.log("Error Registering user")
        return res.json({
            success: false,
            message: error.message
        })
    }
}

const loginUser = async (req, res) => {
    const {email, password} = req.body
    try {
        const user = await userModel.findOne({ email })
        if (!user) {
            console.log("Invalid email credentials")
            return res.json({
                success: false,
                message: "Invalid email Credentials"
            })
        }

        const passwordCorrect = await bcrypt.compare(password, user.password)
        if (!passwordCorrect) {
            console.log("Password is incorrect")
            return res.json({
                success: false,
                message: "Incorrect Password"
            })
        }

        user.last_log = new Date()
        const token = createToken(user._id)
        console.log("User login successful")
        return res.json({
            success: true,
            message: "User Login successful",
            data: user,
            token
        })
    } catch(error) {
        console.log("Error logging in")
        return res.json({
            success: false,
            message: error.message
        })
    }
}

const deleteUser = async (req, res) => {
    const id = req.params.id
    try {
        const user = await userModel.findOne({_id: id})
        if (!user) {
            console.log("Invalid User")
            return res.json({success: false, message: "User doesn't exist"})
        }
        
        const password = req.body.password
        const passwordCorrect = await bcrypt.compare(password, user.password)
        if (!passwordCorrect) {
            console.log("Incorrect Password")
            return res.json({success: false, message: "Incorrect Password"})
        }
        user.profileimg = ""

        await userModel.deleteOne({ _id : id})
        await resumeModel.deleteMany({user_id: id})
        console.log("User deleted Successfully")
        return res.json({
            success: true,
            message: "User deleted Successfuly",
            data: user
        })

    } catch(error) {
        console.log("Error deleting user")
        return res.json({
            success: false,
            message: error.message
        })
    }
}


const deletePfp = async (req, res) => {
    const id = req.params.id
    try {
        const user = await userModel.findOne({_id : id})
        if (!user) {
            console.log("User doesn't exist")
            return res.json({
                succcess: false,
                message: "User doesn't exist"
            })
        }
        console.log("user Profile image:", user.profileimg)
        if (user.profileimg !== "" || user.profileimg) {
            const s3Key = user.profileimg?.split('.amazonaws.com/')[1]
            if (s3Key) {
            s3.deleteObject({
                Bucket: 'resolute-images',
                Key: s3Key
            }, (err, data) => {
                if (err) console.log("S3 delete error:", err)
                else console.log("Old image deleted from S3")
            })
            }
            user.profileimg = ""
            await user.save()

        user.save()
        console.log("new user.profileimg", user.profileimg)
        console.log("pfp deleted")
        return res.json({
            success: true,
            message: "pfp deleted"
        })}
    } catch(error) {

        console.log(error.message)
        return res.json({
            success: false,
            message: error.message
        })
    }
}

const updateUser = async (req, res) => {
    const id = req.params.id
    try {
        const user = await userModel.findOne({_id : id})
        if (!user) {
            console.log("User doesn't exist")
            return res.json({
                succcess: false,
                message: "User doesn't exist"
            })
        }
        if (req.file) {
            // Optionally: delete old image from S3 (needs S3 deleteObject call)

            user.profileimg = req.file.location // S3 URL
        }

        if (req.body.password && req.body.newPassword) {
            const password = req.body.password
            const newPassword = req.body.newPassword
            console.log("new password request: ", req.body.newPassword)
            const passwordCorrect = await bcrypt.compare(password, user.password)
            if(!passwordCorrect) {
                console.log("Incorrect Password")
                return res.json({
                    success: false,
                    message: "Incorrect Password"
                })

            }

            const passwordNoChange = await bcrypt.compare(newPassword, user.password)
            if (passwordNoChange) {
                console.log("You can't make the same password again")
                return res.json({
                    success: false,
                    message: "You can't make the same password again"
                })
            }

            const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!^#%*?&])[A-Za-z\d@$!^#%*?&]{8,}$/
            if (!passwordPattern.test(newPassword)){
                console.log("Invalid New Password")
                return res.json({
                    success: false,
                    message: "Password must contain atleast 8 characters with atleast 1 Capital letter, small letter, digit and special character"
                })
            }
            const hashedPassword = await bcrypt.hash(newPassword, 10)
            user.password = hashedPassword
        }
         
        if (req.body.email) {
            const email = req.body.email
            const emailInUse = await userModel.findOne({ email })
            if (emailInUse) {
                console.log("Email already in use")

                return res.json({
                    success: false,
                    message: "Email is already in use"
                })
            } else {
                user.email = req.body.email || user.email
            }
        }

        user.name = req.body.name || user.name
        if (req.body.bio && req.body.bio.trim() === "") {
            user.bio = ""
        } else {
            user.bio = req.body.bio || user.bio
        }

        await user.save()
        console.log("Profile updated successfully")
        return res.json({
            success: true,
            message: "Profile updated successfully", 
            data: user
        })
    } catch(error) {
        console.log("Error updating user")
        return res.json({
            success: false,
            message: error.message
        })
    }
}

const listUsers = async (req, res) => {
    try {
        const users = await userModel.find({})
        console.log("Users listed successfully")
        return res.json({
            success: true,
            message: "Users listed Successfully",
            data: users
        })
    } catch (error) {
        console.log("Error listing users")
        return res.json({
            success: false,
            message: error.message
        })
    }
}

const displayUser = async (req, res) => {
    const id = req.params.id
    try {
        const user = await userModel.findOne({_id: id})
        if (!user) {
            console.log("User doesn't exist")
            return res.json({
                succcess: false,
                message: "User doesn't exist"
            })
        }
        console.log("User displayed successfully")
        return res.json({
            success: true,
            data: user
        })
    } catch(error) {
        console.log("Error displaying user")
        return res.json({
            success: false,
            message: error.message
        })
    }
}


export { registerUser, loginUser, deleteUser, updateUser, listUsers, displayUser, deletePfp }