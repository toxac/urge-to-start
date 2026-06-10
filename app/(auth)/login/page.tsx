import Link from 'next/link';
import { login } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-background text-foreground">
      <Card className="w-full max-w-md shadow-lg border">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">Welcome Back</CardTitle>
          <CardDescription>
            Enter your credentials to continue building your Minimum Sellable Product.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={login} className="space-y-4">
            {error && (
              <div className="p-3 text-xs rounded-md bg-destructive/10 text-destructive border border-destructive/20 font-medium">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" type="email" placeholder="name@company.com" required />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input id="password" name="password" type="password" required />
            </div>
            <Button type="submit" className="w-full mt-2">
              Sign In to Platform
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-4">
          <p className="text-xs text-muted-foreground">
            First time?{' '}
            <Link href="/signup" className="text-primary font-medium hover:underline">
              Create an account & start your first Quest
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}