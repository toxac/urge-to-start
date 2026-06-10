# App structure

- app/
  - (marketing)/        # Publicly accessible routes
    - page.tsx            # Main landing page for the platform
    - open-events/        # Open IRL/Online events listed for the public
    - feeds/               # aggregated Updates on trends, insights etc. same things we will send out as newsletter
    - blog/
  - (auth)/                 # Authentication routes (Shared minimal layout)
    - login/
    - signup/
    - forgot-password/
  - (onboarding)/           # Linear flow for new signups
    - setup/              # Mindset / Reality-check questionnaire
    - paywall/            # Stripe Checkout portal redirect
  - (platform)/             # Strict Paywalled Ecosystem (Shared Dashboard Layout)
    - dashboard/          # The main Hub: Active Goals & Quests tracker plus events and network
    - program/               # will have routes for goals and quests which will render mdx file
    - network/            # Forum-style community organized around Goals
    - events/             # Full community events calendar (Free + Paid Internal)
    - mentors/            # Directory of vetted industry experts & office hours
    - marketplace/        # Solution Providers (Logistics, Web Hosts, Accountants)
- /content
- /components
- /lib

## Note on middleware

from nextjs docs https://nextjs.org/docs/app/getting-started/proxy

Proxy
Last updated December 20, 2025
Proxy
Good to know: Starting with Next.js 16, Middleware is now called Proxy to better reflect its purpose. The functionality remains the same.

Proxy allows you to run code before a request is completed. Then, based on the incoming request, you can modify the response by rewriting, redirecting, modifying the request or response headers, or responding directly.

Use cases
Some common scenarios where Proxy is effective include:

Modifying headers for all pages or a subset of pages
Rewriting to different pages based on A/B tests or experiments
Programmatic redirects based on incoming request properties
For simple redirects, consider using the redirects configuration in next.config.ts first. Proxy should be used when you need access to request data or more complex logic.

Proxy is not intended for slow data fetching. While Proxy can be helpful for optimistic checks such as permission-based redirects, it should not be used as a full session management or authorization solution.

Using fetch with options.cache, options.next.revalidate, or options.next.tags, has no effect in Proxy.

Convention
Create a proxy.ts (or .js) file in the project root, or inside src if applicable, so that it is located at the same level as pages or app.

Note: While only one proxy.ts file is supported per project, you can still organize your proxy logic into modules. Break out proxy functionalities into separate .ts or .js files and import them into your main proxy.ts file. This allows for cleaner management of route-specific proxy, aggregated in the proxy.ts for centralized control. By enforcing a single proxy file, it simplifies configuration, prevents potential conflicts, and optimizes performance by avoiding multiple proxy layers.

Example
You can export your proxy function as either a default export or a named proxy export:

proxy.ts
TypeScript

TypeScript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
  return NextResponse.redirect(new URL('/home', request.url))
}

// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }

export const config = {
  matcher: '/about/:path*',
}
The matcher config allows you to filter Proxy to run on specific paths. See the Matcher documentation for more details on path matching.



## Notes on previous Step and Errors

### Supabase Client

My supabase server client is structured differently to be used the way we have used in file. We will have to modify the client and pass the params in the client itself so we can use it as we have done now.

lib/supabase/server.ts

```ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const createClient = (cookieStore: Awaited<ReturnType<typeof cookies>>) => {
  return createServerClient(
    supabaseUrl!,
    supabaseKey!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
};
```

### Auth Actions

instead of placing the file in app/auth/actions.ts, i have chosen to use one folder for all actions app/actions/auth.ts



### Callback route

shouldn't the callback route be placed inside a api folder -> app/api/auth/callback/route.ts?



### Auth Provider

I have placed auth provider inside components/providers for consistency

### Theme Provider

I also have theme provider components/theme-provider.tsx which came with shadcn setup. i should move that to providers folder and we should include it in layout right?

components/theme-provider.tsx

```tsx
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"

function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      <ThemeHotkey />
      {children}
    </NextThemesProvider>
  )
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  )
}

function ThemeHotkey() {
  const { resolvedTheme, setTheme } = useTheme()

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.repeat) {
        return
      }

      if (event.metaKey || event.ctrlKey || event.altKey) {
        return
      }

      if (event.key.toLowerCase() !== "d") {
        return
      }

      if (isTypingTarget(event.target)) {
        return
      }

      setTheme(resolvedTheme === "dark" ? "light" : "dark")
    }

    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [resolvedTheme, setTheme])

  return null
}

export { ThemeProvider }


```
