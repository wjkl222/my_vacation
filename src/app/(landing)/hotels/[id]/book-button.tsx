// "use client";

// import { Button } from "~/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "~/components/ui/dialog";
// import { Input } from "~/components/ui/input";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
// } from "~/components/ui/form";
// import { z } from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useMutation } from "@tanstack/react-query";
// import { api } from "~/lib/client/api";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";
// import { Textarea } from "~/components/ui/textarea";
// import { OnError } from "~/lib/client/on_error";
// import { TreatyError } from "~/lib/shared/types/error";

// export default function BookButton({
//   roomId,
//   startDate,
//   endDate,
//   guests,
// }: {
//   roomId: string;
//   startDate: Date;
//   endDate: Date;
//   guests: number;
// }) {
//   const router = useRouter();

//   const BookingSchema = z.object({
//     startDate: z.date(),
//     endDate: z.date(),
//     email: z.string(),
//     name: z.string(),
//     phoneNumber: z.string(),
//     guests: z.number(),
//     additionalInfo: z.string(),
//   });

//   const form = useForm({
//     resolver: zodResolver(BookingSchema),
//     defaultValues: {
//       startDate: startDate,
//       endDate: endDate,
//       guests: guests,
//     } as z.infer<typeof BookingSchema>,
//   });

//   const createPaymentMutation = useMutation({
//     mutationKey: ["createPayment"],
//     mutationFn: async ({
//       id,
//       data,
//     }: { id: string; data: z.infer<typeof BookingSchema> }) => {
//       const { data: paymentUrl, error } = await api
//         .payments({ roomId: id })
//         .post({ ...data });

//       if (error) throw new TreatyError(error);

//       return paymentUrl;
//     },
//     onSuccess: (paymentUrl) => {
//       router.push(paymentUrl!.url);
//       form.reset();
//     },
//     onError: () => {
//       toast.error("Ошибка. Повторите попытку");
//     },
//   });

//   const onSubmit = async (data: z.infer<typeof BookingSchema>) => {
//     await createPaymentMutation.mutateAsync({
//       id: roomId,
//       data: {
//         ...data,
//         guests: guests,
//         startDate: startDate,
//         endDate: endDate,
//       },
//     });
//   };

//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button>Забронировать</Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Забронировать номер</DialogTitle>
//         </DialogHeader>
//         <Form {...form}>
//           <form
//             onSubmit={form.handleSubmit(onSubmit, OnError)}
//             className="space-y-4"
//           >
//             <FormField
//               control={form.control}
//               name="name"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Имя</FormLabel>
//                   <FormControl>
//                     <Input className="w-full" placeholder="Имя" {...field} />
//                   </FormControl>
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="phoneNumber"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Телефон</FormLabel>
//                   <FormControl>
//                     <Input
//                       className="w-full"
//                       placeholder="Номер телефона"
//                       {...field}
//                     />
//                   </FormControl>
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="email"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Почта</FormLabel>
//                   <FormControl>
//                     <Input className="w-full" placeholder="Почта" {...field} />
//                   </FormControl>
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="additionalInfo"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Дополнительная информация</FormLabel>
//                   <FormControl>
//                     <Textarea className="w-full" placeholder="" {...field} />
//                   </FormControl>
//                 </FormItem>
//               )}
//             />
//             <Button
//               className="bg-zinc-500"
//               loading={createPaymentMutation.isPending}
//               type="submit"
//             >
//               Забронировать
//             </Button>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   );
// }
