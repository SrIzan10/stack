import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Page() {
    const { user } = await validateRequest()
    if (!user) return redirect('/auth/signIn')
    return (
        <div>
            <h1 className="text-3xl font-bold text-center">Welcome {user?.username}!</h1>
            <p>You are actually on a protected route!</p>
            <p>Your ID is: {user.id}</p>
        </div>
    )
}