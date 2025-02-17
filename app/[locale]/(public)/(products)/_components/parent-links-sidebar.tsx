import * as React from "react";
import {getProductCategoriesParent} from "@/actions/products/categories/queries";
import {Link} from "@/navigation";
import {getLocale, getTranslations} from "next-intl/server";

export default async function ParentLinksSidebar(props: {
}){
	const {data} = await getProductCategoriesParent()
	const engVer = await getLocale() === 'en'
	const t = await getTranslations();

	if(!data || data.length ===0) return <></>

	return (
		<>
			<div className={''}>
				<h4 className={'font-bold text-lg text-cyan-900 mb-2'}>
					{t("products.collection")}
				</h4>
				<div className="divide-y divide-zinc-400/30">
					{data.map((c, index) => {
						return (
							<Link key={index} className={'block py-3 text-sm font-medium hover:underline'} href={`/${c.slug}`}>
								{engVer ? (c.langEn as any)?.name || c.name : c.name}
							</Link>
						)
					})}
				</div>
			</div>
		</>
	)
}
