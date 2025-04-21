"use client";

import { Input } from "../../../../components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../../../../components/ui/form";
import { Button } from "../../../../components/ui/button";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import { authClient } from "~/lib/client/auth-client";
import { useState } from "react";

export default function PasswordForm({ email }: { email: string }) {

  const [loading, setLoading] = useState(false);
  
  const registerSchema = z.object({
    password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
    passwordConfirm: z.string(),
  });

  type FormValues = z.infer<typeof registerSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      password: "",
      passwordConfirm: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    const user = await authClient.signUp.email({
      ...data, email: email,
      name: ""
    }, {
      onSuccess() {
        redirect("/")
      },
      onError(_error) {
        setLoading(false);
        toast.error("Не удалось создать аккаунт", {
          description: String(_error.error.message),
        });
        console.log(_error)
      },
      onRequest() {
        setLoading(true);
      },
    });
  };

  return (
    <div className="flex flex-row rounded-xl w-[400px]">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col w-full space-y-4"
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="flex bg-input rounded-xl flex-row justify-between pr-4 w-full">
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Пароль"
                    className="w-full rounded-xl border-none bg-transparent focus-visible:ring-0"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="passwordConfirm"
            render={({ field }) => (
              <FormItem className="flex bg-input rounded-xl flex-row justify-between pr-4 w-full">
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Повторите пароль"
                    className="w-full rounded-xl border-none bg-transparent focus-visible:ring-0"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {loading ? "Создание..." : "Создать"}
          </Button>
        </form>
      </Form>
    </div>
  );
}