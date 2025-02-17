import {getProducts, getRandomPublishedProducts} from "@/actions/products/queries";
import React from "react";
import ProductCard from "@/components/public/products/product-card";
import {Button} from "@/components/ui/button";
import {Link} from "@/navigation";
import {ArrowLeft} from "lucide-react";
import {getTranslations} from "next-intl/server";

export default function RelatedProducts(props: {
	productsPromise: ReturnType<typeof getProducts>
}) {
	const {data} = React.use(props.productsPromise)
	const t = React.use(getTranslations());

	if(!data || data.length === 0) return <></>

	return (
		<div className={'container'}>
			<div className={'mb-3 p-5 rounded-t-md'}>
				<h3 className={'text-xl font-bold uppercase'}>{t("products.related")}</h3>
			</div>
			<div className={'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-5'}>
				{data?.slice(0, 8).map((product, index) => (
					<ProductCard product={product} key={product.id} size={'sm'}/>
				))}
			</div>

			<div className={'my-10 text-center flex items-center justify-center'}>
				<Button variant={'dark-destructive'} className={'rounded-xl uppercase'} size={'lg'} asChild>
					<Link href={'/san-pham'}>
						<ArrowLeft className={'size-4 mr-1'}/> {t("products.all")}
					</Link>
				</Button>
			</div>
		</div>
	)
}
