import Elysia, { t } from "elysia";
import { userService } from "./user";
import { db } from "~/server/db";
import { treatmentIndications } from "~/server/db/medicine";
import { eq } from "drizzle-orm";

export const treatmentIndicationsRouter = new Elysia({
    prefix: "/treatmentIndications"
})
    .use(userService)
    .get("/", async () => {
        const result = await db.query.treatmentIndications.findMany();
        return { treatmentIndications: result }
    })
    .post("/", async ({ body }) => {
        await db.insert(treatmentIndications).values(body)
    }, {
        body: t.Object({
            name: t.String()
        })
    })
    .put("/:id", async ({ params, body }) => {
        await db.update(treatmentIndications).set(body).where(eq(treatmentIndications.id, params.id))
    }, {
        params: t.Object({
            id: t.String()
        }),
        body: t.Object({
            name: t.String()
        })
    })
    .delete("/:id", async ({ params }) => {
        await db.delete(treatmentIndications).where(eq(treatmentIndications.id, params.id))
    }, {
        params: t.Object({
            id: t.String()
        })
    })