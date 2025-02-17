import {Montserrat, Merriweather, Inter, Open_Sans, Mulish} from "next/font/google";
import localFont from 'next/font/local'

// export const fontBody = localFont({
// 	variable: '--font-sans',
// 	src: [
// 		{
// 			path: '../public/fonts/HKNova-Regular.otf',
// 			weight: '400',
// 			style: 'normal',
// 		},
// 		{
// 			path: '../public/fonts/HKNova-Medium.otf',
// 			weight: '500',
// 			style: 'normal',
// 		},
// 		{
// 			path: '../public/fonts/HKNova-Bold.otf',
// 			weight: '700',
// 			style: 'normal',
// 		},
// 	],
// })

export const fontBody = Mulish({
	weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
	subsets: ["latin", "vietnamese"],
	display: "swap",
	variable: "--font-sans",
});
export const inter = Inter({
	subsets: ['latin'],
	variable: '--font-inter',
	display: "swap"
})
