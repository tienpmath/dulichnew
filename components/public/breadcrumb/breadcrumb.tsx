import {Link} from "@/navigation";
import {useTranslations} from "next-intl";

export type TBreadItem = {
	title?: string,
	href?: string,
}
export default function BreadCrumb(props:{
	data: TBreadItem[]
}){
	const t = useTranslations();

	return (
		<ul className={'flex flex-wrap gap-2 text-sm'}>
			<li>
				<Link
					title={'Home'}
					className={'text-gray-500 hover:text-black transition-colors'}
					href={'/'}
				>
					{t('menu.home')} /
				</Link>
			</li>
			{props.data.map(link => {
				if(link.href){
					return (
						<li key={link.title}>
							<Link
								className={'text-gray-500 hover:text-black transition-colors'}
								href={link.href}
							>
								{link.title} /
							</Link>
						</li>
					)
				}
				return (
					<li key={link.title} className={'font-medium'}>{link.title}</li>
				)
			})}
		</ul>
	)
}
