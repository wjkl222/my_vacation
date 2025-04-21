import Elysia, { t } from "elysia";
import { userService } from "./user";
import { db } from "~/server/db";
import { medicalBases } from "~/server/db/medicine";
import { eq } from "drizzle-orm";

export const medicalBaseRouter = new Elysia({
    prefix: "/medicalBase"
})
    .use(userService)
    .get("/", async () => {
        const result = await db.query.medicalBases.findMany();
        return { medicalBase: result }
    })
    .post("/", async ({ body }) => {
        await db.insert(medicalBases).values(body)
    }, {
        body: t.Object({
            name: t.String()
        })
    })
    .put("/:id", async ({ params, body }) => {
        await db.update(medicalBases).set(body).where(eq(medicalBases.id, params.id))
    }, {
        params: t.Object({
            id: t.String()
        }),
        body: t.Object({
            name: t.String()
        })
    })
    .delete("/:id", async ({ params }) => {
        await db.delete(medicalBases).where(eq(medicalBases.id, params.id))
    }, {
        params: t.Object({
            id: t.String()
        })
    })