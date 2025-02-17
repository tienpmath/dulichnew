import Image from "next/image";
import {Link, usePathname} from "@/navigation";
import {cn} from "@/lib/utils";
import {useLocale} from "next-intl";

export default function SwitchLangButton(props: {full?: boolean}){
	const pathName = usePathname()
	const locale = useLocale();

	return (
		<ul className={cn("flex items-center gap-3 flex-wrap", {
			"gap-5": Boolean(props.full)
		})}>
			<li>
				<Link href={pathName} className={cn("flex gap-3 items-center text-lg opacity-75 hover:opacity-95 transition-opacity", {"opacity-100": locale === 'vi'})} locale={'vi'}>
					<Image src={'/lang/flag-vi.svg'} alt={'lang-vi'} height={26} width={26} /> {Boolean(props.full) && 'VI'}
				</Link>
			</li>
			<li>
				<Link href={pathName} className={cn("flex gap-3 items-center text-lg opacity-75 hover:opacity-95 transition-opacity", {"opacity-100": locale === 'en'})} locale={'en'}>
					<Image src={'/lang/lang-en.svg'} alt={'lang-en'} height={24} width={24} /> {Boolean(props.full) && 'EN'}
				</Link>
			</li>
		</ul>
	)
}
