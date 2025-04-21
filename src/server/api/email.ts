import Elysia, { t } from "elysia";
import { email } from "../emails";
import { SignUpEmail } from "../emails/sign-up-email";
import { BookingEmail } from "../emails/booking-email";
import { db } from "../db";
import { eq } from 'drizzle-orm';
import { hotels } from "../db/hotel";

export const emailRouter = new Elysia(
    {
        prefix: "/email"
    })
    .post("/send/:email", async ({ params, body }) => {
        await email.send({
            to: params.email,
            subject: "Регистрация",
            body: SignUpEmail({ resetLink: body.link })
        })
    }, {
        params: t.Object({
            email: t.String()
        }),
        body: t.Object({
            link: t.String()
        })
    })
    .post("/send/booking/:email", async ({ params, body }) => {
        const hotel = await db.query.hotels.findFirst({
            where: eq(hotels.id, body.hotelId)
        });
        await email.send({
            to: params.email,
            subject: "Бронирование",
            body: BookingEmail({ ...body, hotelName: hotel!.name })
        })
    }, {
        body: t.Object({
            name: t.String(),
            hotelId: t.String(),
            startDate: t.Date(),
            endDate: t.Date(),
            roomName: t.String(),
            guests: t.Number(),
            price: t.Number(),
        })
    })