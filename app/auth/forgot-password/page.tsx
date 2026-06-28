import Link from 'next/link';
import { forgotPassword } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const { error, success } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-background text-foreground">
      <Card className="w-full max-w-md shadow-lg border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight">Reset Password</CardTitle>
          <CardDescription>
            Enter your email address and we'll send you a safe fallback link to change your access variables.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="p-4 text-sm rounded-md bg-green-500/10 text-green-500 border border-green-500/20 font-medium">
              Check your inbox! We've sent an access link to your account.
            </div>
          ) : (
            <form action={forgotPassword} className="space-y-4">
              {error && (
                <div className="p-3 text-xs rounded-md bg-destructive/10 text-destructive border border-destructive/20 font-medium">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" placeholder="name@domain.com" required />
              </div>
              <Button type="submit" className="w-full mt-2">
                Send Reset Link
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-4">
          <Link href="/login" className="text-xs text-muted-foreground hover:text-primary transition-colors">
            Back to Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}