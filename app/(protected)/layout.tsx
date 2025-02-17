import type { Metadata } from 'next'
import { Toaster } from "@/components/ui/toaster"
import { Toaster as ToasterSonner } from "@/components/ui/sonner"
import {cn} from "@/lib/utils";
import React from "react";
import siteMetadata from "@/config/siteMetadata";
import {TooltipProvider} from "@/components/ui/tooltip";
import {inter} from "@/app/fonts";
import NextTopLoader from "nextjs-toploader";

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

export default async function Layout({children,}: {
	children: React.ReactNode
}) {
	return (
		<>
			<html lang="vi" className={'scroll-smooth'}>
				<body
					suppressHydrationWarning={true}
					className={cn(
						"bg-background font-inter antialiased",
						inter.variable
					)}
				>
					<TooltipProvider>{children}</TooltipProvider>
					<Toaster />
					<ToasterSonner/>
					<div className={'clear-both'}></div>
					<NextTopLoader
						showSpinner={false}
					/>
				</body>
			</html>
		</>
	)
}
