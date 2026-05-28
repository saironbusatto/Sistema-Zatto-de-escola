import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="min-h-dvh flex items-center justify-center bg-[#0d1117]">
      <SignIn />
    </main>
  );
}
