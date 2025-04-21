"use client";

import { Input } from "../../../../components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "../../../../components/ui/form";
import { Button } from "../../../../components/ui/button";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "~/lib/client/api";
import { toast } from "sonner";

export default function EmailForm() {

    const [isBlocked, setIsBlocked] = useState(false);

    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        if (countdown <= 0) return;

        const timer = setTimeout(() => {
            setCountdown(countdown - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [countdown]);

    const registerSchema = z.object({
        email: z.string().email("Пожалуйста, введите корректный email")
    });

    type FormValues = z.infer<typeof registerSchema>;

    const form = useForm<FormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: ""
        }
    });

    const sendEmailMutation = useMutation({
        mutationKey: ["sendEmail"],
        mutationFn: async ({email, link}: {email: string, link: string}) => {
            await api.email.send({email: email}).post({link: link});
        },
        onSuccess: () => {
            toast.success("Отправлено")
        },
        onError: () => {
            toast.error("Ошибка")
        }
    })

    const onSubmit = async (data: FormValues) => {
        setIsBlocked(true);
        const link = `${window.location.origin}/auth/password?email=${encodeURIComponent(data.email)}`
        sendEmailMutation.mutate({email: data.email, link: link})
        setCountdown(300);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
            <div className="flex flex-row rounded-xl w-[400px]">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="flex bg-input rounded-xl flex-row justify-between pr-4 w-full">
                                    <FormControl>
                                        <Input 
                                            placeholder="Почта"
                                            className="w-full rounded-xl border-none bg-transparent focus-visible:ring-0"
                                            {...field}
                                            disabled={isBlocked}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <Button disabled={isBlocked}>{isBlocked ? formatTime(countdown) : 'Отправить'}</Button>
                    </form>
                </Form>
            </div>
    );
}