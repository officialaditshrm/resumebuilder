import mongoose from 'mongoose'

const urlSchema = new mongoose.Schema({
    name: {type: String, required: true},
    url: {type: String, required: true}
})

const miniSectionSchema = new mongoose.Schema({
    head: {type: String, required: true},
    content: {type: String, required: true}
})

const subsubSectionSchema = new mongoose.Schema({
    head: {type: String},
    points: [
        {type: String}
    ],
    urls: [ urlSchema ]
})

const subSectionSchema = new mongoose.Schema({
    head: {type: String, required: true},
    start: {type: Date},
    end: {type: Date},
    ongoing: {type: Boolean, required: true},
    urls: [ urlSchema ],
    subsubsections : [ subsubSectionSchema ]
})

const sectionSchema = new mongoose.Schema({
    head: {type: String, required: true},
    subsections: [ subSectionSchema ],
    miniSections: [ miniSectionSchema ]
})

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
}, {minimize: false})

const resumeModel = mongoose.models.resumes || mongoose.model("resumes", resumeSchema)
export default resumeModel