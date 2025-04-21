import Elysia, { t } from "elysia";
import { userService } from "./user";
import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { facilities } from "~/server/db/facilities";

export const facilitiesRouter = new Elysia({
    prefix: "/facilities"
})
    .use(userService)
    .get("/", async () => {
        const result = await db.query.facilities.findMany();
        return { facilities: result }
    })
    .post("/", async ({ body }) => {
        await db.insert(facilities).values(body)
    }, {
        body: t.Object({
            name: t.String()
        })
    })
    .put("/:id", async ({ params, body }) => {
        await db.update(facilities).set(body).where(eq(facilities.id, params.id))
    }, {
        params: t.Object({
            id: t.String()
        }),
        body: t.Object({
            name: t.String()
        })
    })
    .delete("/:id", async ({ params }) => {
        await db.delete(facilities).where(eq(facilities.id, params.id))
    }, {
        params: t.Object({
            id: t.String()
        })
    })