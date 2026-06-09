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

