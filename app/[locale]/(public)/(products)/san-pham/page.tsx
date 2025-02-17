import {getProductConstants, getProducts} from "@/actions/products/queries";
import {ProductStatus} from ".prisma/client";
import ProductsList from "@/components/public/products/products-list";
import {Metadata} from "next";
import siteMetadata from "@/config/siteMetadata";
import {SearchParams} from "@/types";
import {searchParamsSchema} from "@/actions/products/validations";
import React from "react";
import {Link} from "@/navigation";
import BreadCrumb from "@/components/public/breadcrumb/breadcrumb";
import {PRODUCT_PAGINATION} from "@/enum/enums";
import {SearchProductProvider} from "@/components/public/products/search-product-provider";
import {useTranslations} from "next-intl";
import {getProductCategoriesParent} from "@/actions/products/categories/queries";
import ParentLinksSidebar from "@/app/[locale]/(public)/(products)/_components/parent-links-sidebar";
import {getLocale, getTranslations} from "next-intl/server";
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet";
import {Button} from "@/components/ui/button";
import {FilterIcon, MenuIcon, SlidersHorizontalIcon} from "lucide-react";
import {getSettingBySlug} from "@/actions/settings/queries";
import Image from "next/image";
import BgYoutubeVideo from "@/components/public/video-player/bg-youtube-video";
import CloudImage from "@/components/CloudImage";
import {cn} from "@/lib/utils";

export const metadata: Metadata = {
	title: 'Sản phẩm',
	description: 'Danh sách sản phẩm',
	openGraph: {
		title: 'Sản phẩm',
		description: 'Danh sách sản phẩm',
		images: `${siteMetadata.ogImage}`
	}
}

export default async function Page({searchParams}: {
	searchParams: SearchParams
}) {
	const t = await getTranslations();
	const engVer = await getLocale() === 'en'

	const parsedSearchParams = searchParamsSchema.parse(searchParams)
	const productsPromise = getProducts({
		...parsedSearchParams,
		per_page: PRODUCT_PAGINATION.PER_PAGE,
		status: ProductStatus.PUBLISHED,
		langEn: engVer,
	})
	const {data: setting} = await getSettingBySlug('product')

	const qc_ngang = (setting?.value as any[]).find(i => i.name === 'QC ngang')
	const qc_vuong = (setting?.value as any[]).find(i => i.name === 'Ảnh QC vuông')

	return (
		<div className={'container grid gap-8 grid-cols-3 lg:grid-cols-4'}>
			<div className={'space-y-6 hidden lg:block sticky top-20 h-fit'}>
				<ParentLinksSidebar/>
				<div>
					{qc_vuong.data.map(((img, index) => (
						<Link
							key={index}
							href={String(qc_vuong.data_links[index])}
							className={!String(qc_vuong.data_links[index]) ? 'pointer-events-none' : ''}
							aria-disabled={!String(qc_vuong.data_links[index])}
							tabIndex={!String(qc_vuong.data_links[index]) ? -1 : undefined}
						>
							<CloudImage src={img} alt={'promo'} width={300} height={300} />
						</Link>
					)))}
				</div>
			</div>

			<div className="col-span-3 min-h-screen">
				<div className="space-y-5 mb-5 lg:mb-8">
					<div className={'flex flex-wrap justify-between items-center'}>
						<BreadCrumb data={[
							{
								title: t("products.name"),
							},
						]}/>
					</div>

					<div className={'w-full bg-gray-100 relative'}>
						{qc_ngang?.data.map(((item, index) => (
							<div
								key={index}
								className={cn('rounded-md block mb-0 w-full overflow-hidden aspect-video relative',
								)}
							>
								<BgYoutubeVideo videoId={item} muted={0}/>
							</div>
						)))}
					</div>

					<div className="flex items-start py-2 justify-between">
						<h1 className={'font-semibold ~text-2xl/3xl text-cyan-900'}>
							{t("products.name")}
						</h1>

						<Sheet>
							<SheetTrigger asChild>
								<Button variant={'ghost'} className={'lg:hidden text-center uppercase block'}>
									<SlidersHorizontalIcon className={'size-5 mr-2 inline-block'}/> Filter
								</Button>
							</SheetTrigger>
							<SheetContent side={'left'} className={'!max-w-72'}>
								<div className={'space-y-6'}>
									<ParentLinksSidebar/>
									<div>
										{qc_vuong.data.map(((img, index) => (
											<Link
												key={index}
												href={String(qc_vuong.data_links[index])}
												className={!String(qc_vuong.data_links[index]) ? 'pointer-events-none' : ''}
												aria-disabled={!String(qc_vuong.data_links[index])}
												tabIndex={!String(qc_vuong.data_links[index]) ? -1 : undefined}
											>
												<CloudImage src={img} alt={'promo'} width={300} height={300} />
											</Link>
										)))}
									</div>
								</div>
							</SheetContent>
						</Sheet>
					</div>
				</div>

				<React.Suspense
					fallback={<p className='text-center mx-auto my-8 text-xl'>Loading</p>}
				>
					<SearchProductProvider>
						<ProductsList
							productsPromise={productsPromise}
						/>
					</SearchProductProvider>
				</React.Suspense>
			</div>
		</div>
	)
}
