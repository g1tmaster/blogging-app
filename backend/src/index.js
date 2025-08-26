import "dotenv/config";                    
import  {Hono}  from "hono";              
import  {serve}  from "@hono/node-server";

import pkg from '@prisma/client';
const { PrismaClient } = pkg;
// import {PrismaClient} from '@prisma/client';

// import pkg2 from 'bcrypt';
// const bcrypt = pkg2;
// import {bcrypt} from 'bcrypt';
import {cors} from 'hono/cors';
import posts from './posts.js';
// import { signupSchema, loginSchema } from "./schemas/authSchema.js";
import users from "./users.js";


const app = new Hono();
// const prisma = new PrismaClient();


app.use("*", cors());

// app.post("/signup", async (c) => {
//     try{
//         const body = await c.req.json();

//         const parsed = signupSchema.safeParse(body);
//         if(!parsed.success){
//             return c.json({error: parsed.error.errors[0].message}, 400);
//         }

//         const {name, email, password} = parsed.data;
//         const exists = await prisma.user.findUnique({where: { email}});
//         if(exists) return c.json({error: " User already registered"}, 400);

//         const hashedPassword = await bcrypt.hash(password, 10);

//         const user = await prisma.user.create({
//             data: {
//                 name,
//                 email,
//                 password:hashedPassword,
//             },
//         });

//         return c.json({
//             id:user.id,
//             name:user.name,
//             email: user.email,
//         });
//     }catch(err){
//         console.log(err);
//         return c.json({error: "Signup Failed"}, 500);
//     }
// })

// app.post("/login", async(c) => {
//     console.log("Login route hit ✅");
//     try{
//         const body = await c.req.json();

//         const parsed = loginSchema.safeParse(body);
//         console.log(parsed);
//         if(!parsed.success){
//             return c.json({error: parsed.error.issues[0].message}, 400);
//         }

//         const {email, password} = parsed.data;

//         //find user
//         const user = await prisma.user.findUnique({where: {email}});
//         if(!user){
//             return c.json({error: "User Not Found"}, 401);
//         }

//         //check password
//         // const valid = password === user.password;
//         const valid = await bcrypt.compare(password, user.password);

//         if(!valid){
//             return c.json({error: "Invalid credentials"}, 401);
//         }

//         return c.json({
//             user: {
//                 id: user.id,
//                 name: user.name,
//                 email: user.email,
//             },
//             token: "dummyToken"
//         })
//     }catch (err){
//         console.error(err);
//         return c.json({error: "Login Failed"}, 500);
//     }
// })

app.get("/", (c) => c.text("API ok"));

// app.get("/users", async (c) => {
//     try {
//         const users = await prisma.user.findMany();
//         return c.json(users);
//     }catch(err){
//         console.log(err);
//         return c.json({error: "Something went wrong"}, 500);
//     }
// })

app.route("/users", users);
app.route("/posts", posts);

// app.posts("/posts", aync (c) =>{
//     return c.json([
//         { id: 1, title: "My first blog", content: "Hello World!" },
//         { id: 2, title: "Another blog", content: "This is a test" }
//     ])
// })

const port = Number(process.env.PORT || 8787);

serve({fetch: app.fetch, port});
console.log(`Server running at http://localhost:${port}`);