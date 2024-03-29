"use client"
import { useFormStatus } from "react-dom";

interface IButtonProps {
    // loading: boolean;
    text: string;
}

export default function Button({ text }: IButtonProps) {
    const { pending } = useFormStatus();
    return <button disabled={pending} className="primary-btn h-10 disabled:bg-neutral-400 disabled:text-neutral-300 disabled:cursor-not-allowed">{pending ? <span><span className="loading loading-spinner size-4 relative top-0.5 mr-1"></span> Progress</span> : text}</button>;
} 