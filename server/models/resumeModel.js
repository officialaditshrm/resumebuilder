import mongoose from 'mongoose'

const urlSchema = new mongoose.Schema({
    name: {type: String, required: true},
    url: {type: String, required: true}
})

const miniSectionSchema = new mongoose.Schema({
    head: {type: String, required: true},
    content: {type: String, required: true}
})

const subSectionSchema = new mongoose.Schema({
    head: {type: String, required: true},
    subhead: {type: String},
    start: {type: Date},
    end: {type: Date},
    ongoing: {type: Boolean, required: true}, 
    points: [
        {type: String}
    ],
    urls: [ urlSchema ]
})

const sectionSchema = new mongoose.Schema({
    head: {type: String, required: true},
    subsections: [ subSectionSchema ]
})

const resumeSchema = new mongoose.Schema({
    name: {type: String, required: true},
    summary: {type: String},
    username: {type: String, require: true},
    city: {type: String},
    state: {type: String},
    country: {type: String},
    pincode: {type: String},
    header_urls: [ urlSchema ],
    sections: [ sectionSchema ],
    miniSections: [ miniSectionSchema ]
}, {minimize: false})

const resumeModel = mongoose.models.resumes || mongoose.model("resumes", resumeSchema)
export default resumeModel