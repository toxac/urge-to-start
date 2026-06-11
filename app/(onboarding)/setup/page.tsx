import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { UsernameInput } from '@/components/auth/UsernameInput';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default async function OnboardingKYCPage() {
  async function submitKYCAction(formData: FormData) {
    'use server';
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return redirect('/login');

    const username = (formData.get('username') as string).toLowerCase().trim();
    const ageGroup = formData.get('ageGroup') as string;
    const gender = formData.get('gender') as string;
    const city = formData.get('city') as string;
    const country = formData.get('country') as string;
    const description = formData.get('description') as string;

    // Direct mutation to the updated profiles row
    const { error } = await supabase
      .from('profiles')
      .update({
        username,
        age_group: ageGroup as any,
        gender,
        city,
        country,
        description,
        onboarding_step: 2 // Successfully completed step 1 profile parameters
      })
      .eq('id', user.id);

    if (error) {
      // If server side constraint fails (e.g. race condition on unique username)
      return redirect('/setup?error=' + encodeURIComponent('Username taken or data input invalid.'));
    }

    // Advance directly to the Paywall Gate
    redirect('/paywall');
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-muted/30 text-foreground">
      <Card className="w-full max-w-2xl shadow-xl border bg-card">
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-tight">Claim Your Profile</CardTitle>
          <CardDescription>
            Tell us a bit more about who you are. This lets us drop you into groups facing similar regional or personal constraints.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={submitKYCAction} className="space-y-6">
            
            {/* Unique Username Async Validator Hook */}
            <UsernameInput />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Age Group Enum Select */}
              <div className="space-y-2">
                <Label htmlFor="ageGroup">Age Group</Label>
                <Select name="ageGroup" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select age bracket" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under_18">Under 18</SelectItem>
                    <SelectItem value="18_24">18 - 24</SelectItem>
                    <SelectItem value="25_34">25 - 34</SelectItem>
                    <SelectItem value="35_44">35 - 44</SelectItem>
                    <SelectItem value="45_54">45 - 54</SelectItem>
                    <SelectItem value="55_plus">55+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Gender Text Input */}
              <div className="space-y-2">
                <Label htmlFor="gender">Gender (Optional)</Label>
                <Input id="gender" name="gender" placeholder="e.g., Female, Male, Non-binary" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* City */}
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" placeholder="e.g., Austin" required />
              </div>

              {/* Country */}
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" name="country" placeholder="e.g., United States" required />
              </div>
            </div>

            {/* Founder Description Bio */}
            <div className="space-y-2">
              <Label htmlFor="description">Introduce Yourself to the Network</Label>
              <Textarea 
                id="description" 
                name="description" 
                placeholder="What sort of practical industry experience do you have? Knowing what you already know helps us strip out standard incubation theater." 
                className="min-h-[100px]"
                required 
              />
            </div>

            <Button type="submit" className="w-full text-base font-bold h-11">
              Continue to Safe Checkout
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}