import type { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/auth'
import './globals.css'
import React from "react";
import siteMetadata from "@/config/siteMetadata";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || ''),
  title: {
    template: `%s | ${siteMetadata.logoTitle}`,
    default: `${siteMetadata.logoTitle} - ${siteMetadata.slogan}`,
  },
  description: `${siteMetadata.description}`,
  openGraph: {
    title: {
      template: `%s | ${siteMetadata.logoTitle}`,
      default: `${siteMetadata.logoTitle} - ${siteMetadata.slogan}`,
    },
    description: `${siteMetadata.description}`,
    images: `${siteMetadata.ogImage}`
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  )
}
