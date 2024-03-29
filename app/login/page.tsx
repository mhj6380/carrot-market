"use client"
import Button from "@/components/button";
import Input from "@/components/input";
import SocialLogin from "@/components/social-login";
import { redirect } from "next/navigation";
import { useFormState } from "react-dom";
import { login } from "./actions";
import { PASSWORD_MIN_LENGTH } from "@/lib/contants";


export default function LoginPage() {
    const [state, dispatch] = useFormState(login, null as any);

    return (
        <div className="flex flex-col gap-10 py-8 px-6">
            <div className="flex flex-col gap-2 *:font-medium">
                <h1 className="text-2xl">LOGIN</h1>
                <h2 className="text-xl">Log in with email and password</h2 >
            </div>
            <form action={dispatch} className="flex flex-col gap-3">
                <Input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                    errors={state?.fieldErrors.email}
                />
                <Input
                    type="password"
                    name="password"
                    placeholder="Password"
                    required
                    minLength={PASSWORD_MIN_LENGTH}
                    errors={state?.fieldErrors.password}
                />

                <Button text="Create Account" />
            </form>
            <div className="border-b border-gray-400" />
            <SocialLogin />
        </div>
    )
}