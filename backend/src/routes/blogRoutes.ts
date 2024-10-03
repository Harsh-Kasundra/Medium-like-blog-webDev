import {
    createBlogInput,
    updateBlogInput,
} from "@harsh_kasundra/medium-clone-common";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";

export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    };
    Variables: {
        userId: string;
    };
}>();

//* Middelware
blogRouter.use("/*", async (c, next) => {
    const jwt = c.req.header("Authorization");
    if (!jwt) {
        c.status(401);
        return c.json({ error: "unauthorized" });
    }
    const token = jwt.split(" ")[1];
    const payload = await verify(token, c.env.JWT_SECRET);
    if (!payload) {
        c.status(401);
        return c.json({ error: "unauthorized" });
    }
    c.set("userId", String(payload.id));
    await next();
});

blogRouter.post("/", async (c) => {
    const body = await c.req.json();
    const { success } = createBlogInput.safeParse(body);
    if (!success) {
        c.status(411);
        c.json({
            message: "Invalid Inputs",
        });
    }
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const blog = await prisma.post.create({
        data: {
            title: body.title,
            content: body.content,
            authorId: c.get("userId"),
        },
    });
    return c.json({
        id: blog.id,
    });
});

blogRouter.put("/:id", async (c) => {
    const id = c.req.param("id");

    const body = await c.req.json();
    const { success } = updateBlogInput.safeParse(body);
    if (!success) {
        c.status(411);
        c.json({
            message: "Invalid Inputs",
        });
    }

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const blog = await prisma.post.update({
        where: {
            id: id,
        },
        data: {
            title: body.title,
            content: body.content,
        },
    });
    return c.json({
        id: blog.id,
    });
});

blogRouter.get("/bulk", async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const blogs = await prisma.post.findMany();

    return c.json(blogs);
});

blogRouter.get("/:id", async (c) => {
    const id = c.req.param("id");
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const blog = await prisma.post.findUnique({
        where: {
            id: id,
        },
    });
    return c.json({
        blog,
    });
});
