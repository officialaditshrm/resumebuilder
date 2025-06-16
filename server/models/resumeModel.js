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
    start: {type: Date},
    end: {type: Date},
    urls: [ urlSchema ],
    ongoing: {type: Boolean, require: true}
}, {minimize: false})

const subSectionSchema = new mongoose.Schema({
    head: {type: String, required: true},
    start: {type: Date},
    end: {type: Date},
    ongoing: {type: Boolean, required: true},
    urls: [ urlSchema ],
    subsubsections : [ subsubSectionSchema ]
}, {minimize: false})

const sectionSchema = new mongoose.Schema({
    head: {type: String, required: true},
    subsections: [ subSectionSchema ],
    miniSections: [ miniSectionSchema ]
}, {minimize: false})

const resumeSchema = new mongoose.Schema({
    name: {type: String, required: true},
    user_id: {type: mongoose.Schema.Types.ObjectId, required: true},
    private: {type: Boolean, required: true},
    summary: {type: String, default : ""},
    username: {type: String, required: true},
    city: {type: String, default : ""},
    state: {type: String, default: ""},
    country: {type: String, default: ""},
    pincode: {type: String, default: ""},
    header_urls: [ urlSchema ],
    sections: [ sectionSchema ]
}, {timestamps: true}, {minimize: false})

const resumeModel = mongoose.models.resumes || mongoose.model("resumes", resumeSchema)
export default resumeModel