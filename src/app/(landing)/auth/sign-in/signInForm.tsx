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
} from "../../../../components/ui/form";
import { Button } from "../../../../components/ui/button";
import { toast } from "sonner";
import { authClient } from "~/lib/client/auth-client";
import router from "next/router";
import { redirect } from "next/navigation";

export default function SignInForm() {
  const registerSchema = z.object({
    email: z.string(),
    password: z.string(),
  });

  type FormValues = z.infer<typeof registerSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      password: "",
      email: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    await authClient.signIn.email(data, {
      onSuccess() {
        redirect("/");
      },
      onError(error) {
        console.error(error);
        toast.error("Неверный логин или пароль");
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
            name="email"
            render={({ field }) => (
              <FormItem className="flex bg-input rounded-xl flex-row justify-between pr-4 w-full">
                <FormControl>
                  <Input
                    placeholder="Почта"
                    className="w-full rounded-xl border-none bg-transparent focus-visible:ring-0"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="flex bg-input rounded-xl flex-row justify-between pr-4 w-full">
                <FormControl>
                  <Input
                    placeholder="Пароль"
                    className="w-full rounded-xl border-none bg-transparent focus-visible:ring-0"
                    {...field}
                    type="password"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button>Отправить</Button>
        </form>
      </Form>
    </div>
  );
}
