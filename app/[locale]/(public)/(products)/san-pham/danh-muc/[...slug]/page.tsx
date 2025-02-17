import {getProducts} from "@/actions/products/queries";
import {ProductStatus} from ".prisma/client";
import ProductsList from "@/components/public/products/products-list";
import {notFound} from "next/navigation";
import {Metadata, ResolvingMetadata} from "next";
import siteMetadata from "@/config/siteMetadata";
import {searchParamsSchema} from "@/actions/products/validations";
import React from "react";
import {getProductCategories, getProductCategoryBySlug} from "@/actions/products/categories/queries";
import BreadCrumb from "@/components/public/breadcrumb/breadcrumb";
import Image from "next/image";
import {PRODUCT_PAGINATION} from "@/enum/enums";
import {Link} from "@/navigation";
import {SearchProductProvider} from "@/components/public/products/search-product-provider";
import {FilterProductCategory} from "@/components/public/products/filter-product-category";
import {getLocale, getTranslations} from "next-intl/server";
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet";
import {Button} from "@/components/ui/button";
import {SlidersHorizontalIcon} from "lucide-react";
import {ScrollArea} from "@/components/ui/scroll-area";
import {getSettingBySlug} from "@/actions/settings/queries";
import BgYoutubeVideo from "@/components/public/video-player/bg-youtube-video";
import {TSettingSchema} from "@/actions/settings/validations";
import {cn} from "@/lib/utils";

type Props = {
	params: { slug: string }
	searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
	{ params }: Props,
	parent: ResolvingMetadata
): Promise<Metadata> {
	const {data, error} = await getProductCategoryBySlug(params.slug[params.slug.length-1])

	if(!data || error) {
		return {
			title: 'Not Found'
		}
	}

	return {
		title: `${data.name}`,
		description: `Danh sách sản phẩm trong danh mục: ${data.name}`,
		openGraph: {
			title: `${data.name}`,
			description: `Danh sách sản phẩm trong danh mục: ${data.name}`,
			images: `${siteMetadata.ogImage}`
		}
	}
}

// export async function generateStaticParams() {
// 	const {data, pageCount} = await getProductCategories({
// 		page: 1,
// 		per_page: 1000,
// 	})
// 	const res = data.filter(item => item._count.products !== 0)
//
// 	return res.map((item) => ({
// 		slug: item.slug,
// 	}))
// }

export default async function Page({params, searchParams}: Props){
	const category = await getProductCategoryBySlug(params.slug[0])
	const childCategory = params.slug.length >1 ? await category.data?.childrenCategory.find(i => i.slug === params.slug[1]) : null
	const t = await getTranslations();
	const engVer = await getLocale() === 'en'

	if(!category.data || category.error){
		notFound()
	}

	if(engVer){
		category.data.name = (category.data.langEn as any)?.name || category.data.name
		category.data.description = (category.data.langEn as any)?.description

		if(childCategory){
			childCategory.name = (childCategory.langEn as any)?.name || childCategory.name || category.data.description
			childCategory.description = (childCategory.langEn as any)?.description
		}
	}

	const parsedSearchParams = searchParamsSchema.parse(searchParams)
	const productsPromise = getProducts({
		...parsedSearchParams,
		per_page: PRODUCT_PAGINATION.PER_PAGE,
		status: ProductStatus.PUBLISHED,
		categories: childCategory?.id || [category.data.id].concat(category.data.childrenCategory.map(c => c.id)).join('.'),
	})

	// SETTINGS
	const {data: setting} = await getSettingBySlug('product')

	const banner = (setting?.value as any[]).find(i => i.name === 'Ảnh banner danh mục')
	const qc_ngang = (setting?.value as any[]).find(i => i.name === 'QC ngang')
	const qc_vuong = (setting?.value as any[]).find(i => i.name === 'Ảnh QC vuông')

	function QcNgang () {
		const videoSetting = (category.data?.settings as TSettingSchema[]).find(i => i.name === 'Youtube Video ID')
		const videoSettingID = videoSetting?.data[0]

		if(videoSettingID) {
			return (
				<>
					{videoSetting.data.map(((item, index) => (
						<div
							key={index}
							className={cn('rounded-md block mb-0 w-full overflow-hidden aspect-video relative',
							)}
						>
							<BgYoutubeVideo videoId={item} muted={0}/>
						</div>
						// <Link
						// 	key={index}
						// 	href={String(videoSetting.data_links![index])}
						// 	className={!String(videoSetting.data_links![index]) ? 'pointer-events-none' : ''}
						// 	aria-disabled={!String(videoSetting.data_links![index])}
						// 	tabIndex={!String(videoSetting.data_links![index]) ? -1 : undefined}
						// >
						// 	<BgYoutubeVideo videoId={item}/>
						// 	{/*<Image src={item} alt={'banner'} width={800} height={300} className={'aspect-[8/3] object-center object-cover'}/>*/}
						// </Link>
					)))}
				</>
			)
		}

		return (
			<>
				{qc_ngang.data.map(((item, index) => (
					<div
						key={index}
						className={cn('rounded-md block mb-0 w-full overflow-hidden aspect-video relative',
						)}
					>
						<BgYoutubeVideo videoId={item} muted={0}/>
					</div>
					// <Link
					// 	key={index}
					// 	href={String(qc_ngang.data_links[index])}
					// 	className={!String(qc_ngang.data_links[index]) ? 'pointer-events-none' : ''}
					// 	aria-disabled={!String(qc_ngang.data_links[index])}
					// 	tabIndex={!String(qc_ngang.data_links[index]) ? -1 : undefined}
					// >
					// 	<BgYoutubeVideo videoId={item}/>
					// 	{/*<Image src={item} alt={'banner'} width={800} height={300} className={'aspect-[8/3] object-center object-cover'}/>*/}
					// </Link>
				)))}
			</>
		)
	}

	return (
		<>
			{/*<div className={'-mt-7 lg:-mt-10 xl:-mt-12'}>*/}
			{/*	<picture className={'block w-full mx-auto relative aspect-[12/4] overflow-hidden'}>*/}
			{/*		<Image*/}
			{/*			src={childCategory?.image || category.data.image || banner.data[0]}*/}
			{/*			alt={'category-banner'}*/}
			{/*			fill*/}
			{/*			sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"*/}
			{/*			className={'object-center object-cover w-full'}*/}
			{/*		/>*/}
			{/*	</picture>*/}
			{/*</div>*/}

			<div className={'container grid gap-8 grid-cols-3 lg:grid-cols-4'}>
				<div className={'space-y-6 hidden lg:block sticky top-20 h-[calc(100vh-140px)] overflow-y-auto'}
				     style={{scrollbarWidth: 'thin', scrollbarColor: '#A0AEC0 #EDF2F7'}}
				>
					<div className={''}>
						<h4 className={'font-bold text-lg text-cyan-900 mb-2'}>
							{t("products.collection")}
						</h4>
						{Boolean(category.data.childrenCategory?.length > 0) && (
							<div className="divide-y divide-zinc-400/30">
								{category.data.childrenCategory.filter(v => !Boolean(v.hiddenAtSidebar)).sort((a, b) => Number(a.priority) - Number(b.priority)).map((cat, index) => (
									<Link key={index} className={'block py-3 text-sm font-medium hover:underline uppercase'}
									      href={`/${category.data?.slug}/${cat.slug}`}>{cat.name}</Link>
								))}
							</div>
						)}
					</div>

					<FilterProductCategory category={category.data}/>

					<div>
						{qc_vuong.data.map(((img, index) => (
							<Link
								key={index}
								href={String(qc_vuong.data_links[index])}
								className={!String(qc_vuong.data_links[index]) ? 'pointer-events-none' : ''}
								aria-disabled={!String(qc_vuong.data_links[index])}
								tabIndex={!String(qc_vuong.data_links[index]) ? -1 : undefined}
							>
								<Image src={img} alt={'promo'} width={300} height={300}/>
							</Link>
						)))}
					</div>
				</div>

				<div className="col-span-3 min-h-screen">
					<div className={'space-y-5 mb-5 lg:mb-8'}>
						<BreadCrumb data={[
							{
								title: t("products.name"),
								href: '/san-pham'
							},
							{
								title: category.data.name,
								href: childCategory ? `/${category.data.slug}` : undefined
							},
							{
								title: childCategory?.name,
							}
						]}/>
						<div className={'w-full bg-gray-100 overflow-hidden relative'}>
							<QcNgang/>
						</div>

						<div className="flex items-start py-2 justify-between">
							<h1 className={'font-semibold ~text-2xl/3xl text-cyan-900'}>
								{childCategory?.name || category.data.name}
							</h1>

							<Sheet>
								<SheetTrigger asChild>
									<Button variant={'ghost'} className={'lg:hidden text-center uppercase block'}>
										<SlidersHorizontalIcon className={'size-5 mr-2 inline-block'}/> Filter
									</Button>
								</SheetTrigger>
								<SheetContent side={'left'} className={'!max-w-72 flex'}>
									<ScrollArea className={'flex-grow'}>
										<div className={'space-y-6'}>
											<div className={''}>
												<h4 className={'font-bold text-lg text-cyan-900 mb-2'}>
													{t("products.collection")}
												</h4>
												{Boolean(category.data.childrenCategory?.length > 0) && (
													<div className="divide-y divide-zinc-400/30">
														{category.data.childrenCategory.filter(v => !Boolean(v.hiddenAtSidebar)).sort((a, b) => Number(a.priority) - Number(b.priority)).map((cat, index) => (
															<Link key={index} className={'block py-3 text-sm font-medium hover:underline uppercase'}
															      href={`/${category.data?.slug}/${cat.slug}`}>{cat.name}</Link>
														))}
													</div>
												)}
											</div>

											<FilterProductCategory category={category.data}/>

											<div>
												{qc_vuong.data.map(((img, index) => (
													<Link
														key={index}
														href={String(qc_vuong.data_links[index])}
														className={!String(qc_vuong.data_links[index]) ? 'pointer-events-none' : ''}
														aria-disabled={!String(qc_vuong.data_links[index])}
														tabIndex={!String(qc_vuong.data_links[index]) ? -1 : undefined}
													>
														<Image src={img} alt={'promo'} width={300} height={300}/>
													</Link>
												)))}
											</div>
										</div>
									</ScrollArea>
								</SheetContent>
							</Sheet>
						</div>

						{category.data.description && (
							<p className={'mt-3 text-gray-700'}>
								{childCategory?.description || category.data.description}
							</p>
						)}
						{Number(parsedSearchParams.page) !== 1 ?
							<p className={''}>{`${t('pagination.page')} ${parsedSearchParams.page}`}</p> : ''}
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
		</>
	)
}
