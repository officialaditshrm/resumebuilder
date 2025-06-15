import express from 'express'
import { updateResume, addResume, deleteResume, listResumes, displayResume } from '../controllers/resumeController.js'

const resumeRouter = express.Router()

resumeRouter.post("/", addResume)
resumeRouter.put("/:id", updateResume)
resumeRouter.delete("/:id", deleteResume)
resumeRouter.get("/", listResumes)
resumeRouter.get("/:id", displayResume)

export default resumeRouter