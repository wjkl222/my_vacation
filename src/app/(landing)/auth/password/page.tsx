"use client";

import { useSearchParams } from "next/navigation";
import PasswordForm from "./passwordForm";
import Link from "next/link";

export default function SetPasswordPage() {
    const searchParams = useSearchParams();

    const email = searchParams.get("email");

    if (!email) return null;

    return (
    <div className="h-screen container flex items-center justify-center">
        <div className="flex flex-col space-y-4">
            <div className="flex flex-col">
                <h1 className="font-medium text-2xl">Пароль</h1>
                <p className="text-base text-muted">Создайте свой пароль</p>
            </div>
            <PasswordForm email={email}/>
            <div className="flex flex-row space-x-2 justify-center">
                <p className="text-base text-muted">Уже есть аккаунт?</p>
                <Link href={"/auth/sign-in"}>
                    <p className="text-base text-accent underline">Войти</p>
                </Link>
            </div>
        </div>
    </div>)
}