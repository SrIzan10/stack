'use client'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { signup } from "@/lib/auth/actions";
import SubmitButton from "@/components/app/SubmitButton/SubmitButton";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { useEffect } from "react";

export default function Page() {
  const [signupData, signupAction] = useFormState(signup, null)
  useEffect(() => {
    if (signupData?.error) {
      toast.error(signupData.error)
    }
  }, [signupData])
  return (
    <div className="flex items-center p-6 lg:p-8">
      <div className="w-full max-w-md m-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold pb-1">Sign Up</h1>
        </div>
        <form action={signupAction}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input name="username" required type="text" id="username" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input name="password" required type="password" id="password" />
          </div>
          <SubmitButton buttonText="Create account" className="w-full" />
          <div className="text-center text-sm">
            Already have an account?
            <Link className="underline pl-1" href="/auth/login">
              Login
            </Link>
          </div>
        </div>
        </form>
      </div>
    </div>
  )
}