import {Hono} from 'hono';
import {z} from 'zod';
import bcrypt from 'bcrypt';
// const bcrypt = pkg2;
import {cors} from 'hono/cors';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

const prisma = new PrismaClient();
const users = new Hono();
users.use("*", cors());

export const signupSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({message: "Invalid email"}),
    password: z.string().min(6, {message: "Password must be atleast 6 characters long"}),
})


export const loginSchema = z.object({
     email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
})

users.get("/", async (c) => {
    try {
        const users = await prisma.user.findMany();
        return c.json(users);
    }catch(err){
        console.log(err);
        return c.json({error: "Something went wrong"}, 500);
    }
})

users.post("/signup", async (c) => {
    try{
        const body = await c.req.json();

        const parsed = signupSchema.safeParse(body);
        console.log({parsed});
        if(!parsed.success){
            return c.json({error: parsed.error.errors[0].message}, 400);
        }

        const {name, email, password} = parsed.data;
        const exists = await prisma.user.findUnique({where: { email}});
        if(exists) return c.json({error: " User already registered"}, 400);

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password:hashedPassword,
            },
        });
        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: "1h" }
            );

        return c.json({
            token,
            user: {
                id:user.id,
                name:user.name,
                email: user.email,
            }
        });
    }catch(err){
        console.log(err);
        return c.json({error: "Signup Failed"}, 500);
    }
})


users.post("/login", async(c) => {
    console.log("Login route hit ✅");
    try{
        const body = await c.req.json();

        const parsed = loginSchema.safeParse(body);
        console.log(parsed);
        if(!parsed.success){
            return c.json({error: parsed.error.issues[0].message}, 400);
        }

        const {email, password} = parsed.data;

        //find user
        const user = await prisma.user.findUnique({where: {email}});
        if(!user){
            return c.json({error: "User Not Found"}, 401);
        }

        //check password
        // const valid = password === user.password;
        const valid = await bcrypt.compare(password, user.password);

        if(!valid){
            return c.json({error: "Invalid credentials"}, 401);
        }
        const token = jwt.sign({id: user.id, email: user.email}, JWT_SECRET, {
            expiresIn: "1h",
        })
        
        return c.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        })
    }catch (err){
        console.error(err);
        return c.json({error: "Login Failed"}, 500);
    }
})


export default users;