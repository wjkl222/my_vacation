import Image from "next/image";
import Logo from "../../../public/Logo.svg"
import Title from "../../../public/TXT.svg"
import { CircleUserRound } from "lucide-react";
import Link from "next/link";
import { auth } from "~/server/auth/auth";
import { headers as nextHeaders } from "next/headers";



export default async function LandingNavbar() {

  const session = await auth.api.getSession({
    headers: await nextHeaders(),
  });


  return (
    <header className="fixed top-0 inset-x-0 z-50 flex py-4 px-32 justify-between items-center bg-background border-b border-input">
      <div className="flex flex-row items-center space-x-2">
        <div className="p-1 rounded-md bg-accent">
          <Image src={Logo} alt="logo"/>
        </div>
        <Image src={Title} alt="title"/>
      </div>
      <div className="flex flex-row font-semibold text-xl pr-10">
          <h1 className="text-foreground p-1">Ваш</h1>
          <h1 className="text-accent bg-accent bg-opacity-10 p-1 rounded-md">идеальный</h1>
          <h1 className="text-foreground p-1">отдых начинается здесь</h1>
      </div>
      <Link className="flex flex-row space-x-2" href={session ? "/profile" : "/auth/sign-up"}>
        <CircleUserRound/>
        <h1>{session ? "Личный кабинет" : "Создать аккаунт"}</h1>
      </Link>
    </header>
  );
}
