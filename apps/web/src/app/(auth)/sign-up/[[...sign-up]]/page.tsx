import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="min-h-dvh flex items-center justify-center bg-[#0d1117]">
      <SignUp />
    </main>
  );
}
