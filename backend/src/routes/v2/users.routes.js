import bcrypt from "bcrypt";
import { Router } from "express";
import { User } from "../../models/user.model.js";

export const router = Router();

// Read users
router.get("/", async (req, res, next) => {
    try{
        // 1. Get user data from db
const users = await User.find();
        // 2. Send response object back to client
return res.json(users)

    }catch(err){
        next(err);
    }
    
});

// Create user
router.post("/", async (req, res, next) => {
    try{
        const { username, email, password } = req.body;

        if( !username || !email || !password ) {
            return res.status(400).json({error: "username, email and password are required"});
        }

     const saltRounds = 12;
     const hashedPassword = await bcrypt.hash(password, saltRounds);

     const newUser = await User.create({ 
      username, 
      email, 
      password 
    });

     const {password: _password, ...userWithoutPassword} = newUser.toObject()
     return res.status(201).json(userWithoutPassword);

    } catch (err) {
      next(err);
    }
    
});

// Update user
router.put("/:id", async (req, res, next) => {
  try {
    const updateData = { ...req.body };

    if (updateData.password) {
      const saltRounds = 12;
      updateData.password = await bcrypt.hash(updateData.password, saltRounds);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res
      .status(404)
      .json({ error: "User not found" });
    }

    const { password: _password, ...userWithoutPassword } = updatedUser.toObject();
    return res.json(userWithoutPassword);
  } catch (err) {
    next(err);
  }
});

// Delete user
router.delete("/:id", async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ message: "User deleted successfully" });
  } catch (err) {
    next(err);
  }
});

// Login user
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // 1. ค้นหา User ตาม Email
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // 2. ตรวจสอบรหัสผ่านด้วย bcrypt.compare
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // 3. ส่ง Response กลับโดยตัด password ออก
    const { password: _password, ...userWithoutPassword } = user.toObject();
    return res.json({ message: "Login successful", user: userWithoutPassword });
  } catch (err) {
    next(err);
  }
});