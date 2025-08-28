import "dotenv/config";                    
import  {Hono}  from "hono";              
// for local deployment uncomment below
// import  {serve}  from "@hono/node-server";

import {cors} from 'hono/cors';
import posts from './posts.js';
import users from "./users.js";
import pkg from '@vercel/hono';
const { handle } = pkg;



const app = new Hono();


app.use("*", cors());

app.route("/users", users);
app.route("/posts", posts);


const port = Number(process.env.PORT || 8787);


//for local deployment run this below codes -->
// serve({fetch: app.fetch, port});
// console.log(`Server running at http://localhost:${port}`);


export default handle(app);
