import express from 'express'
import { registerUser, loginUser, updateUser, deleteUser, listUsers, displayUser } from '../controllers/userController.js'

const userRouter = express.Router()

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.put("/:id", updateUser)
userRouter.delete("/:id", deleteUser)
userRouter.get("/", listUsers)
userRouter.get("/:id", displayUser)

export default userRouter