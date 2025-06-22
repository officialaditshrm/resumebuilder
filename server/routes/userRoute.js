import express from 'express'
import { registerUser, loginUser, updateUser, deleteUser, listUsers, deletePfp, displayUser } from '../controllers/userController.js'
import multer from 'multer'

const userRouter = express.Router()

const storage = multer.diskStorage({
  destination: 'pfpuploads',
  
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`)
  },
})
const upload = multer({ storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }
 })

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.put("/:id", upload.single('profileimg'), updateUser)
userRouter.delete("/:id", deleteUser)
userRouter.get("/", listUsers)
userRouter.get("/:id", displayUser)
userRouter.delete("/deletepfp/:id", deletePfp)

export default userRouter