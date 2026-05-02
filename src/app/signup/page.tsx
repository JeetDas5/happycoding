import { signUpAction } from "@/actions/auth.actions"
import { SignupForm } from "@/components/signup-form"

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-zinc-50 p-4 dark:bg-black sm:p-6 md:p-10">
      <div className="w-full max-w-lg">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Happy Coding
            </h1>
          </div>
          <SignupForm action={signUpAction} />
        </div>
      </div>
    </div>
  )
}
