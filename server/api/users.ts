import { Router } from "express";       
import { randomUUID } from "crypto";      
import bcrypt from "bcrypt"; 
import { auth } from "./middleWare/auth";
import { db } from "../db/index";
import { users } from "../db/schema";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";

const JWT_SECRET = "dev-secret";
export const usersRouter = Router();
//middleWare
//
usersRouter.get("/me", auth, (req, res) => {
  res.json(req.user);
});

//Register
usersRouter.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "missing username or password" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  try {

    await db.insert(users).values({
      id: randomUUID(),
      username,
      passwordHash
    });

    console.log("Added a new User:" + username)

    res.json({ ok: true });
  } catch {
    res.status(400).json({ error: "username already exists" });
  }
});

//user login
usersRouter.post("/login", async (req,res) => {
  const {username, password} = req.body ?? {};

  if(!username || !password){
    return res.status(400).json({error:"missing username or password"});
  }

  const result = await db.select().from(users).where(eq(users.username, username ))

  const user = result[0];


  if (!user){
    return res.status(401).json({error:"invalid credentials"});
  }

  const valid = await bcrypt.compare(password, user.passwordHash);

  if (!valid) {
    return res.status(401).json({error:"invalid credentials"});
  }
  //expires 24h, should probably be less in future
  const token = jwt.sign(
    {userId: user.id, username: user.username},
    JWT_SECRET,
    {expiresIn: "24h"}
  )


  res.json({token});

});
