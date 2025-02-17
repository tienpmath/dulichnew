import NextAuth from "next-auth";

import authConfig from "@/auth.config";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  dashboardAuthPrefix,
} from "@/routes";
import createMiddleware from "next-intl/middleware";
import {NextRequest} from "next/server";
import {locales} from "@/i18n";
const { auth } = NextAuth(authConfig);

const intlMiddleware = createMiddleware({
  locales: locales,
  defaultLocale: 'vi',
  localeDetection: false,
  localePrefix: "as-needed",
});

// @ts-ignore
const authMiddleware = auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isDashboardRoute = nextUrl.pathname.startsWith(dashboardAuthPrefix);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return null;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }
    return null;
  }

  if (!isLoggedIn && isDashboardRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return Response.redirect(new URL(
      `/auth/login?callbackUrl=${encodedCallbackUrl}`,
      nextUrl
    ));
  }

  return null;
})

export default function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isDashboardRoute = nextUrl.pathname.startsWith(dashboardAuthPrefix);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  const isPublicPage = !(isApiAuthRoute || isDashboardRoute || isAuthRoute)

  if (isPublicPage) {
    return intlMiddleware(req);
  } else {
    return (authMiddleware as any)(req);
  }
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
  // matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}


