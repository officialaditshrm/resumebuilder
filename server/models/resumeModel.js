import mongoose from 'mongoose'


const urlSchema = new mongoose.Schema({
    name: {type: String},
    url: {type: String, required: true}
})

const miniSectionSchema = new mongoose.Schema({
    head: {type: String},
    content: {type: String}
})

const roleSchema = new mongoose.Schema({
    rolename: {type: String, required: true},
    rolesummary: {type: String},
    start: {type: Date},
    end: {type: Date},
    ongoing: {type: Boolean, required: true},
    points: [
        {type: String}
    ],
    extras: [
        {type: String}
    ],
    urls: [ urlSchema ]
}, {minimize: false})

const projectSchema = new mongoose.Schema({
    projectname: {type: String, required: true},
    projectsummary: {type: String},
    start: {type: Date},
    end: {type: Date},
    ongoing: {type: Boolean, required: true},
    points: [
        {type: String}
    ],
    extras: [
        {type: String}
    ],
    urls: [ urlSchema ],
    stack: miniSectionSchema
}, {minimize: false})

const subSectionSchema = new mongoose.Schema({
    title: {type: String, required: true},
    summary: {type: String},
    start: {type: Date},
    end: {type: Date},
    points: [
        {type: String}
    ],
    extras: [
        {type: String}
    ],
    urls: [ urlSchema ]
}, {minimize: false})

const educationSchema = new mongoose.Schema({
    institution: { type: String, required: true },
    qualifications: [{
        name: {type: String, required: true},
        grades: {type: String},
        start: {type: Date},
        end: {type: Date},
        ongoing: {type: Boolean, required: true},
        description: {type: String},
        extras: [
            {type: String}
        ],
        urls: [
            urlSchema
        ]
    }]
}, {minimize: false})


const extraSectionSchema = new mongoose.Schema({
    sectionName : {type: String, required: true},
    subsections : [
        subSectionSchema
    ]
}, {minimize: false})


const resumeSchema = new mongoose.Schema({
    name: {type: String, required: true}, //done
    user_id: {type: mongoose.Schema.Types.ObjectId, required: true}, //done
    private: {type: Boolean, required: true}, //done
    resumesummary: {type: String}, //done
    username: {type: String, required: true}, //done
    city: {type: String}, //done
    state: {type: String}, //done
    country: {type: String}, //done
    pincode: {type: String}, //done
    header_urls: [ urlSchema ], //done
    education: [ educationSchema ], //done
    projects: [ projectSchema ], //done
    experience: [ {
        organization: {type: String, required: true},
        roles: [ roleSchema ],
        extras: [
            {type: String}
        ],
        urls: [ urlSchema ]
    } ],
    skills: [ miniSectionSchema ], //done
    extraSections: [ extraSectionSchema ], 
}, {timestamps: true}, {minimize: false})

const resumeModel = mongoose.models.resumes || mongoose.model("resumes", resumeSchema)
export default resumeModel
