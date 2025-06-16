import resumeModel from '../models/resumeModel.js'
import userModel from '../models/userModel.js'

const addResume = async (req, res) => {
    const id = req.body.user_id
    try{
        const user = await userModel.findOne({ _id: id })

        if (!user) {
            console.log("User doesn't exist")
            return res.json({
                success: false,
                messasge: "User doesn't exist"
            })
        }

        const newResume = new resumeModel(req.body)
        const resume = await newResume.save()
        resume.private ? user.private_resumes.push(resume._id) : user.public_resumes.push(resume._id)
        await user.save()

        console.log("Resume Added Successfully")
        return res.json({
            success: true,
            message: "Resume Added Successfully",
            data: resume
        })
    } catch(error){
        console.log("Error adding resume")
        return res.json({
            success: true,
            message: error.message
        })
    }
}

const updateResume = async (req, res) => {
    const id = req.params.id
    try{
        const resume = await resumeModel.findOne({_id: id})
        if (!resume) {
            console.log("Cannot find the resume")
            return res.json({
                success: false,
                message: "Cannot find the resume"
            })
        }
        resume.name = req.body.name || resume.name
        resume.private = req.body.private || resume.private
        resume.summary = req.body.summary || resume.summary
        resume.username = req.body.username || resume.username
        resume.city = req.body.city || resume.city
        resume.state = req.body.state || resume.state
        resume.country = req.body.country || resume.country
        resume.pincode = req.body.pincode || resume.pincode
        resume.header_urls = req.body.header_urls || resume.header_urls
        resume.sections = req.body.sections || resume.sections
        resume.miniSections = req.body.miniSections || resume.miniSections

        await resume.save()

        console.log("Resume updated successfully")
        return res.json({
            success: true,
            message: "Resume updated successfully",
            data: resume
        })
    } catch(error){
        console.log("Error updating resume")
        res.json({
            success: false,
            message: error.message
        })
    }
}

const deleteResume = async(req, res) => {
    const id = req.params.id
    try {
        const resume = await resumeModel.findOne({_id: id})
        if (!resume) {
            console.log("Resume not found")
            return res.json({
                success: false,
                message: "Resume not found"
            })
        }

        await resumeModel.deleteOne({ _id : id })

        console.log("Resume deleted successfully")
        return res.json({
            success: true,
            message: "Resume deleted successfully",
            data: resume
        })
    } catch(error) {
        console.log("Error updating resume")
        return res.json({
            success: false,
            message: error.message
        })
    }
}

const listResumes = async (req, res) => {
    try {
        const resumes = await resumeModel.find({})
        console.log("Resumes listed successfully")
        return res.json({
            success: true,
            data: resumes
        })
    } catch (error) {
        console.log("Error listing resumes")
        return res.json({
            success: false,
            message: error.message
        })
    }
}

const displayResume = async (req, res) => {
    const id = req.params.id
    try {
        const resume = await resumeModel.findOne({_id: id})
        if (!resume) {
            console.log("Resume not found")
            return res.json({
                success: false,
                message: "Resume not found"
            })
        }
        console.log("Resume displayed successfully")
        return res.json({
            success: true,
            data: resume
        })
    } catch(error) {
        console.log("Error displaying resume")
        return res.json({
            success: false,
            message: error.message
        })
    }
}

export { addResume, updateResume, deleteResume, listResumes, displayResume }