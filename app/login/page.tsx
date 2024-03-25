"use client"
import FormButton from "@/components/form-btn";
import FormInput from "@/components/form-input";
import SocialLogin from "@/components/social-login";
import { redirect } from "next/navigation";
import { useFormState } from "react-dom";
import { handleForm } from "./actions";


export default function LoginPage() {
    const [state, action] = useFormState(handleForm, null as any);

    return (
        <div className="flex flex-col gap-10 py-8 px-6">
            <div className="flex flex-col gap-2 *:font-medium">
                <h1 className="text-2xl">LOGIN</h1>
                <h2 className="text-xl">Log in with email and password</h2 >
            </div>
            <form action={action} className="flex flex-col gap-3">
                <FormInput
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                />
                <FormInput
                    type="password"
                    name="password"
                    placeholder="Password"
                    required
                />

                <FormButton text="Create Account" />
            </form>
            <div className="border-b border-gray-400" />
            <SocialLogin />
        </div>
    )
}