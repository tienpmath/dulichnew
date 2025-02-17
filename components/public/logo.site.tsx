import siteMetadata from "@/config/siteMetadata";
import Image from "next/image";
import {cn} from "@/lib/utils";
import {Link} from "@/navigation";

export default function SiteLogo({align, href, sizeLg, width, dark}: {
	align?: 'center',
	href?: string,
	sizeLg?: boolean,
	width?: number,
	dark?: boolean
}){
	const defaultWidth = 140
	let w = Boolean(width) ? width : defaultWidth
	if(Boolean(sizeLg)){
		w = 190
	}

	return (
		<Link
			className={'text-xl font-semibold'}
			href={href || '/'}
			title={siteMetadata.logoTitle}
		>
			<Image
				className={cn("transition-all",{
					'block mx-auto my-2': align === 'center'
				})}
				src={Boolean(dark) ? siteMetadata.logoDarkSrc : siteMetadata.logoSrc}
				alt={siteMetadata.logoTitle}
				width={w}
				height={37}
			/>
		</Link>
	)
}
