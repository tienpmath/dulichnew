import {parseProductImages, TProductWithRelation} from "@/actions/products/validations";
import {Link} from "@/navigation";
import Image from "next/image";
import {cn} from "@/lib/utils";
import {rgbDataURL} from "@/lib/rgbDataUrl";
import {Badge} from "@/components/ui/badge";
import {useLocale, useTranslations} from "next-intl";
import * as React from "react";
import CloudImage from "@/components/CloudImage";

export default function ProductCard({product, size}: {
	product: TProductWithRelation,
	size?: 'sm' | 'md',
}) {
	const isHot = product.tags.find((tag) => tag.slug === 'hot-trend')
	const hasDiscount = typeof product.price === 'number' && Number(product.fakePrice) > 0
	const discountPercent = hasDiscount ? Math.round((product.fakePrice! - product.price!) / product.fakePrice! * 100) : 0
	const engVer = useLocale() === 'en'

	if(engVer){
		product.title = (product.langEn as any)?.title || product.title
	}
	const t = useTranslations('products');

	return (
		<div
			className={cn('group w-full product-item border border-gray-200 relative flex-col justify-start items-start gap-1 inline-flex bg-white transition-all ease-out', {
				'border-yellow-600': Boolean(isHot),
			})}>
			{parseProductImages(product.images)[0]?.url && (
				<div className={'w-full'}>
					<Link href={`/san-pham/${product.slug}`} className={'block'}>
						<picture className={'block mb-0 w-full overflow-hidden aspect-square relative'}>
							<CloudImage
								src={parseProductImages(product.images)[0]?.url} alt={`${product.title}`}
								className={'transition duration-300 ease-in-out group-hover:scale-110 object-center object-contain w-full h-full'}
								width={400}
								height={300}
								quality={90}
							/>
						</picture>
					</Link>
					{Boolean(isHot) && (
						<div className={'absolute top-2 left-0'}>
							<Link href={'/san-pham/tags/hot-trend'}>
								<Badge className={'rounded-l-none'} variant={'destructive'}>Hot</Badge>
							</Link>
						</div>
					)}
					{hasDiscount && (
						<div className={'absolute top-2 right-0'}>
							<Badge className={'rounded-r-none'} variant={'warning'}>
								-{discountPercent}%
							</Badge>
						</div>
					)}
				</div>
			)}

			<div className="my-1 px-1 lg:my-3 mx-auto w-full">
				<h3 title={product.title} className={cn("text-center font-semibold m-0 leading-snug line-clamp-2 h-12", {
				})}>
					<Link href={`/san-pham/${product.slug}`} className={'transition-all duration-150  font-bold text-cyan-900 hover:text-blue-500'}>
						{product.title}
					</Link>
				</h3>
				<div className={'px-2 flex flex-col lg:flex-row gap-3 items-center w-full'}>
					{typeof product.price === 'number' && (
						<div className="flex flex-wrap w-fit mx-auto gap-3 gap-y-0 lg:gap-x-5 justify-center items-center">
							<div className="text-red-700 text-base font-bold">
								{Number(product.price).toLocaleString('vi-VN')} vnđ
							</div>
							{hasDiscount && (
								<div className="text-sm line-through text-gray-600">
									{Number(product.fakePrice).toLocaleString('vi-VN')} vnđ
								</div>
							)}
						</div>
					)}
				</div>

			</div>
		</div>
	)
}
