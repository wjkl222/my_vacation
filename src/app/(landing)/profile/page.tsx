import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { api } from "~/server/api";
import { auth } from "~/server/auth/auth";
import { ProfileInfo } from "./profileInfo";

export default async function Profile() {

    const session = await auth.api.getSession({
        headers: await headers(),
      });
    
      if (!session) {
        redirect("/");
      }


      const bookings = await api.bookings.user({userId: session.user.id}).get()

    return (
            <ProfileInfo bookings={bookings.data!.bookings} name={session.user.name} email={session.user.email}/>
    )
}