import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Welcome to Our App</h1>
      <div className="space-x-4">
        <Button asChild>
          <Link href="/v2/sing-in">Sign In</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/v2/sign-up">Sign Up</Link>
        </Button>
        <Button asChild variant="link">
          <Link href="/v2/forgot-password">Forgot Password</Link>
        </Button>
      </div>
    </div>
  );
}