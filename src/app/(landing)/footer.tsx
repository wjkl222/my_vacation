import FooterSubscribe from "~/components/custome/footerSubscribe";
import Telegram from "../../../public/Telegram.svg"
import WhatsApp from "../../../public/whatsapp (2).svg"
import Vk from "../../../public/vk.svg"
import Image from "next/image";

export function Footer() {
  return (
    <div className="flex flex-col w-full px-32 py-12 space-y-9 border-t border-input">
      <div className="flex flex-row w-full justify-center items-center">
        <div className="flex flex-row font-semibold text-xl pr-10 space-x-3">
          <h1 className="text-accent bg-accent bg-opacity-10 p-1 rounded-md">Новости</h1>
          <h1 className="text-foreground p-1">вашего отдыха</h1>
        </div>
        <FooterSubscribe/>
      </div>
      <div className="flex flex-row justify-between border-t border-input pt-10">
        <p className="text-sm text-muted">© 2025 Мой отдых. Все права защищены.</p>
        <div className="flex flex-row space-x-5">
          <div>
            <Image src={Telegram} alt="telegram icon" className="size-full"/>
          </div>
          <div>
            <Image src={WhatsApp} alt="whatsapp icon" className="size-full"/>
          </div>
          <div>
            <Image src={Vk} alt="VK icon" className="size-full"/>
          </div>
        </div>
      </div>
    </div>
  );
}
