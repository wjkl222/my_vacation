import { treaty } from "@elysiajs/eden";
import { Elysia } from "elysia";
import { headers as getNextHeaders } from "next/headers";
import { userRouter } from "./routers/user";
import { hotelsRouter } from "./routers/hotels";
import { emailRouter } from "./email";
import { treatmentIndicationsRouter } from "./routers/treatmentIndications";
import { medicalBaseRouter } from "./routers/medicalBase";
import { facilitiesRouter } from "./routers/facilities";
import { bookingRouter } from "./routers/booking";


export const app = new Elysia({ prefix: "/api" })
  .onTransform((data) => {
    data.set.headers["content-type"] = "text/plain";
  })
  .use(userRouter)
  .use(emailRouter)
  .use(hotelsRouter)
  .use(treatmentIndicationsRouter)
  .use(medicalBaseRouter)
  .use(facilitiesRouter)
  .use(bookingRouter)
  .use(userRouter)

export type App = typeof app;
export const api = treaty(app).api;

export async function headers(): Promise<Record<string, string | undefined>> {
  const h = await getNextHeaders();
  const headers: Record<string, string | undefined> = {};
  for (const [key, value] of h.entries()) {
    headers[key] = value;
  }
  return headers;
}
