import Elysia, { t } from "elysia";
import { userService } from "./user";
import { db } from "~/server/db";
import { bookings } from "~/server/db/bookings";
import { eq } from "drizzle-orm";
import { subscribers } from "~/server/db/user";

export const bookingRouter = new Elysia({
    prefix: "/bookings"
})
    .use(userService)
    .get("/", async () => {
        const result = await db.query.bookings.findMany({
            with: {
                hotel: true,
                room: true
            }
        });
        return result
    })
    .post("/", async ({ body, session }) => {
        await db.insert(bookings).values({
            ...body,
            user: session!.user.id
        })

    }, {
        body: t.Object({
            name: t.String(),
            hotelId: t.String(),
            email: t.String(),
            startDate: t.Date(),
            endDate: t.Date(),
            phoneNumber: t.String(),
            additionalInfo: t.String(),
            guests: t.Number(),
            roomId: t.String(),
            price: t.Number()
        })
    })
    .delete("/:bookingId", async ({ params }) => {
        await db.delete(bookings).where(eq(bookings.id, params.id))
    }, {
        params: t.Object({
            id: t.String()
        })
    })
    .get("/user/:userId", async ({ params }) => {
        const result = await db.query.bookings.findMany({
            where: eq(bookings.user, params.userId),
            with: {
                hotel: true,
                room: true
            }
        })
        return { bookings: result }
    }, {
        params: t.Object({
            userId: t.String()
        })
    })
    .get("/room/:roomId", async ({ params }) => {
        const result = await db.query.bookings.findMany({
            where: eq(bookings.roomId, params.roomId)
        })
        return { bookings: result }
    }, {
        params: t.Object({
            roomId: t.String()
        })
    })
    .put("/activate/:bookingId", async ({ params }) => {
        await db.update(bookings).set({ isActive: true }).where(eq(bookings.id, params.bookingId));
    })
    .post("/sub", async ({ body }) => {
        await db.insert(subscribers).values(body)
    }, {
        body: t.Object({
            email: t.String()
        })
    })