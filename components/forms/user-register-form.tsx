"use client";
import { signUpWithEmailAndPassword } from "@/app/actions";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "../ui/use-toast";

const formSchema = z
  .object({
    email: z
      .string({
        required_error: "Email is required",
      })
      .email({ message: "Enter a valid email address" }),
    password: z
      .string({
        required_error: "Password is required",
      })
      .min(8, { message: "Password must be at least 8 characters long" }),
    passwordConfirmation: z.string({
      required_error: "Password confirmation is required",
    }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  });

type UserFormValue = z.infer<typeof formSchema>;

export default function UserRegisterForm() {
  let [loading, startTransition] = useTransition();
  const [isActive, setIsActive] = useState<Boolean>(false);
  const router = useRouter();
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: UserFormValue) => {
    startTransition(async () => {
      const result = await signUpWithEmailAndPassword(data);
      const { error } = JSON.parse(result);
      if (error?.message) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "User created successfully",
        });
      }

      if (!error) {
        router.push("/");
      }
    });
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2 w-full"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email..."
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={isActive ? "text" : "password"}
                      placeholder="Enter your password..."
                      disabled={loading}
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      className="absolute inset-y-0 right-0"
                      onClick={() => setIsActive(!isActive)}
                    >
                      {isActive ? (
                        <EyeClosedIcon fontSize={16} />
                      ) : (
                        <EyeOpenIcon fontSize={16} />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="passwordConfirmation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={isActive ? "text" : "password"}
                      placeholder="Enter your password..."
                      disabled={loading}
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      className="absolute inset-y-0 right-0"
                      onClick={() => setIsActive(!isActive)}
                    >
                      {isActive ? (
                        <EyeClosedIcon fontSize={16} />
                      ) : (
                        <EyeOpenIcon fontSize={16} />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={loading} className="ml-auto w-full" type="submit">
            <Loader
              className={cn(
                "animate-spin mr-2 h-4 w-4",
                loading ? "block" : "hidden",
              )}
            />
            <span>Register</span>
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="relative flex items-center justify-center text-sm">
          <span className="bg-background text-muted-foreground">
            Have an account?
          </span>
          <Link href="/" className={cn(buttonVariants({ variant: "link" }))}>
            Login
          </Link>
        </div>
      </div>
    </>
  );
}
