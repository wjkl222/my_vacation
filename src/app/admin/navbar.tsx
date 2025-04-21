import Image from "next/image";
import Logo from "../../../public/Logo.svg"
import Title from "../../../public/TXT.svg"
import Link from "next/link";
import { Button } from "~/components/ui/button";



export default async function AdminNavbar() {

  return (
    <header className="fixed top-0 inset-x-0 z-50 flex py-4 px-32 justify-between items-center bg-background border-b border-input">
      <div className="flex flex-row items-center space-x-2">
        <div className="p-1 rounded-md bg-accent">
          <Image src={Logo} alt="logo"/>
        </div>
        <Image src={Title} alt="title"/>
      </div>
      <div className="flex flex-row font-semibold text-xl pr-10 space-x-8">
          <Link href={"/admin/hotels"}>
            <Button>Санатории</Button>
          </Link>
          <Link href={"/admin/facilities"}>
            <Button>Удобства</Button>
          </Link>
          <Link href={"/admin/treatmentIndications"}>
            <Button>Показания к лечению</Button>
          </Link>
          <Link href={"/admin/medicalbase"}>
            <Button>Лечебные базы</Button>
          </Link>
      </div>
    </header>
  );
}
