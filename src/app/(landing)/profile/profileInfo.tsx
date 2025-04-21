"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { BookingWithHotels } from "~/lib/shared/types/hotel";
import { Form, FormControl, FormField, FormItem } from "~/components/ui/form";
import { authClient } from "~/lib/client/auth-client";
import { Input, PasswordInput } from "~/components/ui/input";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "~/components/ui/alert-dialog"
import { X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";


export function ProfileInfo({
    bookings,
    name,
    email,
}: {
  bookings: BookingWithHotels[];
  name: string;
  email: string
}) {

  const tabs = ["bookings", "settings"] as const;

  const [tab, selectTab] = useState<(typeof tabs)[number]>(tabs[0]);

  const searchParams = useSearchParams();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const newBooking = searchParams.get('newBooking') === 'true';
    setIsOpen(newBooking);
  }, [searchParams]);

  const handleClose = () => {
    setIsOpen(false);
    router.replace('/profile', { scroll: false });
  };

  const signOut = async () => {
    await authClient.signOut()
    router.push("/")
  }

  return (
    <div className="pt-32 container space-y-12 mb-6">
      <div className="p-6 rounded-3xl bg-white flex gap-2 text-sm items-center">
        <Link href="/">
          <Button variant="link" className="p-0 size-fit text-muted">
            Главная
          </Button>
        </Link>
        <p className="text-muted-foreground">{"/"}</p>
        <p className="text-muted-foreground font-medium">Личный кабинет</p>
        <p className="text-muted-foreground">{"/"}</p>
        <p className="text-accent">
          {tab === tabs[0] ? "Бронирование" : "Настройки"}
        </p>
      </div>
      <div className="flex flex-row gap-6 justify-between">
        <div className="flex flex-col space-y-6">
          <div className="p-4">
            <h1 className="text-foreground font-semibold text-xl">
              {name === "" ? "Незнакомец" : name}
            </h1>
          </div>
          <div className="flex flex-col">
            <Button onClick={() => selectTab(tabs[0])} className={tab === tabs[0] ? "text-accent font-semibold bg-background justify-start" : "text-muted-foreground bg-background justify-start"}>Бронирование</Button>
            <Button onClick={() => selectTab(tabs[1])} className={tab === tabs[1] ? "text-accent font-semibold bg-background justify-start" : "text-muted-foreground bg-background justify-start"}>Настройки</Button>
            <Button onClick={async () => await signOut()} className="bg-background text-muted-foreground justify-start">Выйти</Button>
          </div>
        </div>
        {tab === tabs[0] ? <Bookings bookings={bookings}/> : <Settings name={name} email={email}/>}
      </div>
      <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent className="w-[430px] p-4">
        
        <AlertDialogHeader className="flex flex-col space-y-4">
          <AlertDialogTitle className="text-foreground font-medium flex flex-row justify-between">
            <p>Бронирование</p>
            <button
            onClick={() => handleClose()}
            className=""
            >
            <X className="h-5 w-5 text-muted-foreground" />
            </button>
            </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground text-center">
            Ваш отдых в санатории официально<br/> подтверждён, и мы очень рады, что вы выбрали<br/> 
            "Мой отдых" для планирования своего<br/> оздоровительного путешествия.
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
    </div>
  );
}


function Bookings({bookings} : {bookings: BookingWithHotels[]}) {
    return (
        <div className="flex flex-col space-y-6 min-w-[651px]">
           {bookings.map((item) => (
            <div className="flex flex-row space-x-2 p-2 shadow-[0_0_5px_0_rgba(0,0,0,0.1)] rounded-lg">
                <div className="size-32 aspect-square">
                    <Image src={item.hotel.image} alt="hotel image" width={100} height={100} className="rounded-lg size-full aspect-square"/>
                </div>
                <div className="flex flex-col justify-between w-full">
                    <div className="flex flex-row justify-between space-x-28 w-full">
                        <div className="flex flex-col">
                            <h1 className="text-foreground font-semibold text-xl">{item.hotel.name}</h1>
                            <p className="text-muted-foreground">{item.hotel.country}</p>
                        </div>
                        <p className="text-muted-foreground">{item.isActive ? "Подтверждено" : "В обработке"}</p>
                    </div>
                    <div>
                        <p className="text-foreground font-medium">{item.room.name}</p>
                        <p className="text-accent font-medium">{item.room.size}m</p>
                    </div>
                </div>
            </div>
           ))} 
        </div>
    )
}

function Settings({name, email}: {name: string, email: string}) {

  const router = useRouter()

    const changeEmailNameForm = z.object({
      email: z.union([
        z.string().email({ message: "Некорректный формат почты" }), 
        z.literal("")
      ]).optional(),
        name: z.optional(z.string())
    })

    const emailNameForm = useForm({
        resolver: zodResolver(changeEmailNameForm),
        defaultValues: {
            name: "",
            email: ""
        },
        mode: "onSubmit"
    })

    async function onSubmitEmailName(data: z.infer<typeof changeEmailNameForm>) {
        if (data.name != name && data.name != ""){
            await authClient.updateUser({
                name: data.name
            })
            emailNameForm.reset()
            router.refresh()
        } else {
          if(data.name == name && data.name != ""){
            toast.success("У Вас уже указано это имя")
          }
          emailNameForm.reset()
        }
        if (data.email != email && data.email != "") {
            await authClient.changeEmail({newEmail: data.email!})
            emailNameForm.reset()
            router.refresh()
        } else {
          if (data.email == email) {
            toast.success("Ваш аккаунт уже привязан к этой почте")
          }
          emailNameForm.reset()
        }
    }

    const changePasswordSchema = z.object({
        currentPassword: z.string(),
        newPassword: z.string().min(1),
        confirmNewPassword: z.string()
    })

    const passwordForm = useForm({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {} as z.infer<typeof changePasswordSchema>
    })

    async function onSubmitPassword(data: z.infer<typeof changePasswordSchema>) {
        await authClient.changePassword(data, {
            onSuccess() {
                passwordForm.reset()
                toast.success("Пароль изменен")
            },
            onError() {
                toast.error("Ошибка")
            }
        })
    }

    return (
        <div className="flex flex-col w-2/5 space-y-6 mb-4">
            <div className="flex flex-col space-y-6">
                <h1 className="text-black font-medium">Персональные данные</h1>
                <Form {...emailNameForm}>
                <form
                    onSubmit={emailNameForm.handleSubmit(onSubmitEmailName)}
                    className="space-y-4"
                >
                    <FormField
                    control={emailNameForm.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormControl>
                            <Input
                            {...field}
                            placeholder={name=="" ? "ФИО" : name}
                            required={false}
                            />
                        </FormControl>
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={emailNameForm.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormControl>
                            <Input
                            {...field}
                            placeholder={email}
                            required={false}
                            />
                        </FormControl>
                        </FormItem>
                    )}
                    />
                    <Button
                    type="submit"
                    className=""
                    >
                    Изменить
                    </Button>
                </form>
                </Form>
            </div>
            <div className="flex flex-col space-y-6">
                <h1 className="text-black font-medium">Изменить пароль</h1>
                <Form {...passwordForm}>
                <form
                    onSubmit={passwordForm.handleSubmit(onSubmitPassword)}
                    className="space-y-4"
                >
                    <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                        <FormItem>
                        <FormControl>
                            <PasswordInput
                            placeholder="Старый пароль"
                            {...field}
                            />
                        </FormControl>
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                        <FormItem>
                        <FormControl>
                            <PasswordInput
                            placeholder="Новый пароль"
                            {...field}
                            />
                        </FormControl>
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={passwordForm.control}
                    name="confirmNewPassword"
                    render={({ field }) => (
                        <FormItem>
                        <FormControl>
                            <PasswordInput
                            placeholder="Повторите новый пароль"
                            {...field}
                            />
                        </FormControl>
                        </FormItem>
                    )}
                    />
                    <Button
                    type="submit"
                    className=""
                    >
                    Изменить
                    </Button>
                </form>
                </Form>
            </div>
        </div>
    )
}
