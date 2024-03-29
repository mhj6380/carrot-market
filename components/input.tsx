import { InputHTMLAttributes } from "react"

interface IInputProps {
    name: string, errors?: string[]
}

export default function Input({
    errors = [], name, ...rest
}: IInputProps & InputHTMLAttributes<HTMLInputElement>) {
    return (
        <div className="flex flex-col gap-2">
            <input className="bg-transparent rounded-md w-full h-10 focus:outline-none ring-1 focus:ring-2 ring-neutral-200 focus:ring-orange-500 border-none placeholder:text-neutral-400 transition" name={name} {...rest} />
            {errors.map((error, index) => (
                <span key={index} className="text-red-500 font-medium">{error}</span>
            ))}
        </div>
    )
}