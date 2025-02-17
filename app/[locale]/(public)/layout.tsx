import React from "react";
import Header from "@/components/public/layout/header/header";
import Footer from "@/components/public/layout/footer/footer";

import '@/styles/public/index.css'
import '@/styles/public/blog/index.css'
import {GoogleAnalytics} from "@next/third-parties/google";
import SocialLinks from "@/components/public/socials/social-links";
import {cn} from "@/lib/utils";
import {fontBody, inter} from "@/app/fonts";
import {TooltipProvider} from "@/components/ui/tooltip";
import {Toaster} from "@/components/ui/toaster";
import {Toaster as ToasterSonner} from "@/components/ui/sonner";
import {getMessages} from 'next-intl/server';
import {NextIntlClientProvider} from 'next-intl';
import Hotline from "@/components/public/hotline/hotline";
import NextTopLoader from "nextjs-toploader";

export default async function PublicLayout({
 children, params: {locale}
}: {
	children?: React.ReactNode,
	params: {locale: string};
}) {
	const messages = await getMessages();

	return (
		<html lang={locale} className={'scroll-smooth'}>
			<body
				suppressHydrationWarning={true}
				className={cn(
					"bg-background font-sans antialiased",
					fontBody.variable,
					inter.variable
				)}
			>
				<NextIntlClientProvider messages={messages}>
					<TooltipProvider>
						<Header/>
						<div className={'wrapper-body grid grid-cols-1 gap-7 lg:gap-10 py-7 lg:py-10 xl:py-12'}>
							{children}
						</div>
						<Footer/>
						<Hotline/>
						<SocialLinks/>
					</TooltipProvider>
					<Toaster />
					<ToasterSonner/>
					{Boolean(process.env.NEXT_PUBLIC_GA_ID) && (
						<GoogleAnalytics gaId={String(process.env.NEXT_PUBLIC_GA_ID)} />
					)}
					<div className={'clear-both'}></div>
					<NextTopLoader
						showSpinner={false}
					/>
				</NextIntlClientProvider>
			</body>
		</html>
	)
}
