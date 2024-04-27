'use client'

import { Button, ButtonProps, buttonVariants } from "@/components/ui/button"
import { VariantProps } from "class-variance-authority"
import { useFormStatus } from "react-dom"

export default function SubmitButton(props: Props) {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" loading={pending} {...props}>
            {props.buttonText}
        </Button>
    )
}

export interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    buttonText: string;
}