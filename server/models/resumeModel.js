import mongoose from 'mongoose'

const urlSchema = new mongoose.Schema({
    name: {type: String},
    url: {type: String, required: true}
})

const miniSectionSchema = new mongoose.Schema({
    head: {type: String},
    content: {type: String}
})

const subsubSectionSchema = new mongoose.Schema({
    head: {type: String, required: true},
    summary: {type: String},
    points: [
        {type: String}
    ],
    start: {type: Date},
    end: {type: Date},
    extras: [
        {type: String}
    ],
    urls: [ urlSchema ],
}, {minimize: false})

const subSectionSchema = new mongoose.Schema({
    head: {type: String, required: true},
    summary: {type: String},
    start: {type: Date},
    end: {type: Date},
    points: [
        {type: String}
    ],
    extras: [
        {type: String}
    ],
    urls: [ urlSchema ],
    subsubsections : [ subsubSectionSchema ],
    minisections: [ miniSectionSchema ]
}, {minimize: false})

const sectionSchema = new mongoose.Schema({
    summary: {type: String},
    head: {type: String, required: true},
    subsections: [ subSectionSchema ],
    minisections: [ miniSectionSchema ],
}, {minimize: false})

const resumeSchema = new mongoose.Schema({
    name: {type: String, required: true},
    user_id: {type: mongoose.Schema.Types.ObjectId, required: true},
    private: {type: Boolean, required: true},
    summary: {type: String},
    username: {type: String, required: true},
    city: {type: String},
    state: {type: String},
    country: {type: String},
    pincode: {type: String},
    header_urls: [ urlSchema ],
    sections: [ sectionSchema ]
}, {timestamps: true}, {minimize: false})

const resumeModel = mongoose.models.resumes || mongoose.model("resumes", resumeSchema)
export default resumeModel