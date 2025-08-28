import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function authMiddleware(c, next) {
    const authHeader = c.req.header("Authorization");
    if(!authHeader?.startsWith("Bearer")) {
        return c.json({error: "Unauthorized"}, 401);
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        c.set("user", decoded);
        await next();
    } catch (err){
        return c.json({error: "Invalid Token"}, 401);
    }
}