import EmailForm from "~/app/(landing)/auth/sign-up/emailForm";
import Link from "next/link";

export default function SignUp() {
    return (
    <div className="h-screen container flex items-center justify-center">
        <div className="flex flex-col space-y-4">
            <div className="flex flex-col">
                <h1 className="font-medium text-2xl">Регистрация</h1>
                <p className="text-base text-muted">Введите свою почту</p>
            </div>
            <EmailForm/>
            <div className="flex flex-row space-x-2 justify-center">
                <p className="text-base text-muted">Уже есть аккаунт?</p>
                <Link href={"/auth/sign-in"}>
                    <p className="text-base text-accent underline">Войти</p>
                </Link>
            </div>
        </div>
    </div>)
}