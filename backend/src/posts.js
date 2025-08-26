import {Hono} from 'hono';
import {z} from 'zod';
import {zValidator} from '@hono/zod-validator';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import { authMiddleware } from './middleware/auth.js';

const prisma = new PrismaClient();
const posts = new Hono();


export const postSchema = z.object({
  title: z.string().min(1, "Title cannot be empty"),
  content: z.string().min(1, "Content cannot be empty"),
  authorId: z.number().int().positive("Invalid authorId"),
});



const createSchema = z.object({
  title: z.string().min(1, "title is required"),
  content: z.string().min(1, "content is required"),
});

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
});

posts.get("/", async (c) => {
    const data = await prisma.post.findMany({
        include: { author:{select: {id: true, email: true, name: true}}},
        orderBy: {createdAt: "desc"},
    });

    return c.json(data);
})

posts.get("/:id", async(c) =>{
    const id = Number(c.req.param("id"));
    if(Number.isNaN(id)) return c.json({error: "Invalid id"}, 400);

    const post = await prisma.post.findUnique({
        where: {id},
        include: {author:{select: {id: true, email: true, name: true}}},
    })

    if(!post) return c.json({error: "posts not found"}, 400);
    return c.json(post);
})

posts.post("/", authMiddleware, zValidator("json", createSchema), async (c) =>{
  try {
    // const body = c.req.valid("json");
    // const parsed = postSchema.safeParse(body);
    // if(!parsed.success) {
    //   return c.json({error: parsed.error.issues}, 400);
    // }
    const { title, content} = c.req.valid("json");
    const user = c.get("user");

    console.log("USER FROM JWT:", user);

    const newPost = await prisma.post.create({
    data: { title, content, authorId: user.id},
    include: {author: {select: {id: true, email: true, name:true}}}
  })
  return c.json(newPost, 201);
  }catch (err){
    console.error(err);
    return c.json({ error: "Failed to create post"}, 500);
  }
})


posts.put("/:id", authMiddleware, zValidator("json", updateSchema), async (c) => {
  const id = Number(c.req.param("id"));
  if(Number.isNaN(id)) return c.json({error: "Invalid Id"}, 400);

  const user = c.get("user");
  const data = c.req.valid("json");
  try{
    const post = await prisma.post.findUnique({where: {id}});
    if(!post) return c.json({error: "post not found"}, 400);
    if(post.authorId !== user.id) return c.json({error: "Forbidden: Not your post"}, 403);

    const updated = await prisma.post.update({
      where: {id},
      data,
    })
    return c.json(updated);
  }catch{
    return c.json({error: "post not found"}, 404);
  }
})

posts.delete("/:id", authMiddleware, async (c) => {
  const id = Number(c.req.param("id"));
  if(Number.isNaN(id)) return c.json({error: "Invalid id"}, 400);
  // console.log(id);
  const user = c.get("user");

  try{
    const post = await prisma.post.findUnique({where: {id}});
    // console.log("this is post", post);
    if(!post) return c.json({error: "post not found"}, 400);
    if(post.authorId !== user.id) return c.json({error: "Forbidden: Not your post"}, 403);
    // console.log("before delete");
    await prisma.post.delete({where: {id}});
    // console.log("inside delete");
    return c.json({ok: true});
  }catch{
    return c.json({error: "post not found"}, 404);
  }
})

export default posts;
