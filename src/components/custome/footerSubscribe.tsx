"use client";

import { Mail } from "lucide-react";
import { Input } from "../ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import { api } from "~/lib/client/api";
import { toast } from "sonner";

export default function FooterSubscribe() {
    const subscribeSchema = z.object({
        email: z.string().email("Пожалуйста, введите корректный email")
    });

    const form = useForm<z.infer<typeof subscribeSchema>>({
        resolver: zodResolver(subscribeSchema),
        defaultValues: {
            email: ""
        }
    });

    const subscribeMutation = useMutation({
        mutationKey: ["subscribe"],
        mutationFn: async (data: z.infer<typeof subscribeSchema>) => {
            await api.bookings.sub.post(data)
        }, 
        onSuccess: () => {
            toast.success("Спасибо за подписку!")
            form.reset()
        },
        onError: () => {
            toast.error("Ошибка")
        }
    })

    const onSubmit = async (data: z.infer<typeof subscribeSchema>) => {
        subscribeMutation.mutate(data)
    };

    return (
        <div>
            <div className="flex flex-row rounded-xl justify-between px-4 py-3">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center w-full space-x-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="flex bg-input rounded-xl flex-row justify-between pr-4 w-[421px]">
                                    <FormControl>
                                        <Input 
                                            placeholder="Ваша почта"
                                            className="w-full rounded-xl border-none focus:outline-none bg-transparent focus-visible:ring-0"
                                            {...field}
                                        />
                                    </FormControl>
                                    <Mail className="h-6 w-6 text-muted-foreground" />
                                </FormItem>
                            )}
                        />
                        <Button>Подписаться</Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}