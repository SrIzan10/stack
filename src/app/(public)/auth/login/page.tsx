"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useFormState } from "react-dom";
import { login } from "@/lib/auth/actions";
import SubmitButton from "@/components/app/SubmitButton/SubmitButton";
import { useEffect } from "react";
import { toast } from "sonner";

export default function Page() {
	const [formData, formAction] = useFormState(login, null);
  useEffect(() => {
    if (formData?.error) {
      toast.error(formData.error)
    }
  }, [formData])

  return (
    <div className="flex items-center p-4 lg:p-8">
      <div className="w-full max-w-md m-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold pb-1">Log In</h1>
        </div>
        <form action={formAction}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Username</Label>
              <Input name="username" id="username" required type="text" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input name="password" id="password" required type="password" />
            </div>
            <SubmitButton buttonText="Log In" className="w-full" />
            <div className="text-center text-sm">
              No account?
              <Link className="underline pl-1" href="/auth/signUp">
                Create one!
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
