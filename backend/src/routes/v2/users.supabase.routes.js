import { Router } from "express";
import { supabase } from "../../config/supabase.js";

export const router = Router();

// Read all users
router.get("/", async (req, res, next) => {
  try {
    const { data, error } = await supabase.from("users").select("*");
    if (error) throw error;
    return res.json(data);
  } catch (err) {
    next(err);
  }
});

// Create user
router.post("/", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const { data, error } = await supabase
      .from("users")
      .insert([{ username, email, password }])
      .select();

    if (error) throw error;
    return res.status(201).json(data[0]);
  } catch (err) {
    next(err);
  }
});

// Update user
router.put("/:id", async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .update(req.body)
      .eq("id", req.params.id)
      .select();

    if (error) throw error;
    if (!data.length) return res.status(404).json({ error: "User not found" });

    return res.json(data[0]);
  } catch (err) {
    next(err);
  }
});

// Delete user
router.delete("/:id", async (req, res, next) => {
  try {
    const { error } = await supabase
      .from("users")
      .delete()
      .eq("id", req.params.id);

    if (error) throw error;
    return res.json({ message: "User deleted successfully" });
  } catch (err) {
    next(err);
  }
});