import EmailForm from "~/app/(landing)/auth/sign-up/emailForm";
import Link from "next/link";
import SignInForm from "./signInForm";

export default function SignIn() {
    return (
    <div className="h-screen container flex items-center justify-center">
        <div className="flex flex-col space-y-4">
            <div className="flex flex-col">
                <h1 className="font-medium text-2xl">Вход</h1>
                <p className="text-base text-muted">Введите свою почту и пароль</p>
            </div>
            <SignInForm/>
            <div className="flex flex-row space-x-2 justify-center">
                <p className="text-base text-muted">Нет аккаунта?</p>
                <Link href={"/auth/sign-up"}>
                    <p className="text-base text-accent underline">Создать</p>
                </Link>
            </div>
        </div>
    </div>)
}