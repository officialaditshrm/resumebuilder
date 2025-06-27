import express from 'express'
import multer from 'multer'
import multerS3 from 'multer-s3'
import s3 from '../config/s3.js' // adjust path as needed

import {
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
  listUsers,
  deletePfp,
  displayUser
} from '../controllers/userController.js'

const userRouter = express.Router()

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'resolute-images', //  replace with actual S3 bucket
    key: (req, file, cb) => {
      cb(null, `pfpimages/${Date.now()}-${file.originalname}`)
    }
  }),
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
