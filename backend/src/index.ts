import { Hono } from "hono";

const app = new Hono();

app.post("/api/v1/signup", (c) => {
    return c.text("post ");
});

app.post("/api/v1/signin", (c) => {
    return c.text("post ");
});

app.post("/api/v1/blog", (c) => {
    return c.text("post ");
});

app.put("/api/v1/blog", (c) => {
    return c.text("post ");
});

app.get("/api/v1/blog/:id", (c) => {
    return c.text("post ");
});

app.get("/api/v1/blug/bulk", (c) => {
    return c.text("post ");
});

export default app;
