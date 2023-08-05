import express, { Request, Response } from "express"; // Importing function from express package as well as Request and Response
import { loginUser, signupUser } from "../controllers/userController";

const router = express.Router();

//login route
router.post("/login", loginUser);

//signup route

router.post("/signup", signupUser);

export default router;