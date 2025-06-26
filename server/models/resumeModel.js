import mongoose from 'mongoose'


const urlSchema = new mongoose.Schema({
    name: {type: String},
    url: {type: String, }
})

const miniSectionSchema = new mongoose.Schema({
    head: {type: String},
    content: {type: String}
})

const roleSchema = new mongoose.Schema({
    rolename: {type: String, },
    rolesummary: {type: String},
    start: {type: Date, default: ""},
    end: {type: Date, default: ""},
    ongoing: {type: Boolean, },
    points: [
        {type: String}
    ],
    extras: [
        {type: String}
    ],
    urls: [ urlSchema ]
}, {minimize: false})

const projectSchema = new mongoose.Schema({
    projectname: {type: String, },
    projectsummary: {type: String},
    start: {type: Date, default: ""},
    end: {type: Date, default: ""},
    ongoing: {type: Boolean, },
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
    title: {type: String, },
    summary: {type: String},
    start: {type: Date, default: ""},
    end: {type: Date, default : ""},
    ongoing: {type: Boolean, },
    points: [
        {type: String}
    ],
    extras: [
        {type: String}
    ],
    urls: [ urlSchema ]
}, {minimize: false})

const educationSchema = new mongoose.Schema({
    institution: { type: String,  },
    qualifications: [{
        name: {type: String, },
        grades: {type: String},
        start: {type: Date, default: ""},
        end: {type: Date, default: ""},
        ongoing: {type: Boolean, },
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
    sectionName : {type: String, },
    subsections : [
        subSectionSchema
    ]
}, {minimize: false})


const resumeSchema = new mongoose.Schema({
    name: {type: String, required: true}, 
    user_id: {type: mongoose.Schema.Types.ObjectId, required: true}, 
    private: {type: Boolean, required: true}, 
    phonenum: {type: String, default: ""},
    resumesummary: {type: String}, 
    username: {type: String, required: true}, 
    city: {type: String}, 
    email: {type: String},
    state: {type: String}, 
    country: {type: String}, 
    pincode: {type: String}, 
    header_urls: [ urlSchema ], 
    education: [ educationSchema ], 
    projects: [ projectSchema ], 
    views: {type: Number},
    experience: [ {
        organization: {type: String, },
        roles: [ roleSchema ],
        extras: [
            {type: String}
        ],
        urls: [ urlSchema ]
    } ],
    skills: [ miniSectionSchema ], 
    extraSections: [ extraSectionSchema ],
    feedback: [
        {
            user_id: {type: mongoose.Schema.Types.ObjectId, required: true},
            text: {type: String, required: true}
        }
    ]
}, {timestamps: true}, {minimize: false})

const resumeModel = mongoose.models.resumes || mongoose.model("resumes", resumeSchema)
export default resumeModel
