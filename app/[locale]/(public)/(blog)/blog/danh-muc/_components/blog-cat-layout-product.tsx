import Image from "next/image";
import BreadCrumb from "@/components/public/breadcrumb/breadcrumb";
import React from "react";
import PostsList from "@/components/public/posts/posts-list";
import {getLocale, getTranslations} from "next-intl/server";
import {getPostCategoryBySlug} from "@/actions/posts/categories/queries";
import {notFound} from "next/navigation";
import {getPosts} from "@/actions/posts/queries";
import {getSettingBySlug} from "@/actions/settings/queries";
import {TSettingSchema} from "@/actions/settings/validations";
import {Link} from "@/navigation";
import BgYoutubeVideo from "@/components/public/video-player/bg-youtube-video";
import {FilterProductCategory} from "@/components/public/products/filter-product-category";
import {POST_PAGINATION} from "@/enum/enums";
import {PostStatus} from ".prisma/client";
import {cn} from "@/lib/utils";

export default async function BlogCatLayoutProduct(props:{
	category: Awaited<ReturnType<typeof getPostCategoryBySlug>>,
	params: any
}){
	const {category, params} = props
	const childCategory = params.slug.length >1 ? await category.data?.childrenCategory.find(i => i.slug === params.slug[1]) : null
	
	if(!category.data || category.error){
		return <></>
	}
	
	const t = await getTranslations();
	const engVer = await getLocale() === 'en'
	
	if(engVer){
		category.data.name = (category.data.langEn as any)?.name || category.data.name
		category.data.description = (category.data.langEn as any)?.description
		
		if(childCategory){
			childCategory.name = (childCategory.langEn as any)?.name || childCategory.name || category.data.description
			childCategory.description = (childCategory.langEn as any)?.description
		}
	}
	
	const postsPromise = getPosts({
		page: 1,
		per_page: POST_PAGINATION.PER_PAGE,
		status: PostStatus.PUBLISHED,
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
	
	return(
		<>
			<div className={'container grid gap-8 grid-cols-3 lg:grid-cols-4'}>
				<div className={'space-y-6 hidden lg:block'}>
					<div className={''}>
						<h4 className={'font-bold text-lg text-cyan-900 mb-2'}>
							{t("products.collection")}
						</h4>
						{Boolean(category.data.childrenCategory?.length > 0) && (
							<div className="divide-y divide-zinc-400/30">
								{category.data.childrenCategory.sort((a, b) => Number(a.priority) - Number(b.priority)).map((cat, index) => (
									<Link key={index} className={'block py-3 text-sm font-medium hover:underline uppercase'}
									      href={`/${category.data?.slug}/${cat.slug}`}>{cat.name}</Link>
								))}
							</div>
						)}
					</div>
					
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
								title: category.data.name
							}
						]}/>
						<div className={' w-full bg-gray-100 overflow-hidden relative'}>
							<QcNgang/>
						</div>
						
						<div className="flex items-start py-2 justify-between">
							<h1 className={'font-semibold ~text-2xl/3xl text-cyan-900'}>
								{childCategory?.name || category.data.name}
							</h1>
						</div>
						
						{category.data.description && (
							<p className={'mt-3 text-gray-700'}>
								{category.data.description}
							</p>
						)}
					</div>
					
					<div className="-mx-5">
						<React.Suspense
							fallback={<p className='text-center mx-auto my-8 text-xl'>Loading</p>}
						>
							<PostsList
								postsPromise={postsPromise}
								currentPage={1}
								navLink={`/blog/danh-muc/${params.slug[0]}`}
							/>
						</React.Suspense>
					</div>
				</div>
			</div>
		</>
		)
		}
