import Image from "next/image";
import BreadCrumb from "@/components/public/breadcrumb/breadcrumb";
import React from "react";
import PostsList from "@/components/public/posts/posts-list";
import {getLocale, getTranslations} from "next-intl/server";
import {getPostCategoryBySlug} from "@/actions/posts/categories/queries";
import {notFound} from "next/navigation";
import {getPosts} from "@/actions/posts/queries";

export default async function BlogCatLayout01(props:{
	category: Awaited<ReturnType<typeof getPostCategoryBySlug>>,
	postsPromise: ReturnType<typeof getPosts>,
	params: any
}){
	const {category, postsPromise, params} = props
	
	if(!category.data || category.error){
		return <></>
	}
	
	const t = await getTranslations();
	const engVer = await getLocale() === 'en'
	
	if(engVer){
		category.data.name = (category.data.langEn as any)?.name || category.data.name
		category.data.description = (category.data.langEn as any)?.description
	}
	
	
	return(
		<>
			{category.data.image && (
				<div className={''}>
					<picture className={'block max-h-[40vh] w-full aspect-[12/8] mx-auto lg:aspect-[12/4] relative'}>
						<Image
							src={category.data.image || '/images/category-banner.jpg'}
							alt={'category-banner'}
							fill
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
							className={'object-center object-cover'}
						/>
					</picture>
				</div>
			)}
			
			<div className={'max-w-4xl container space-y-4'}>
				<BreadCrumb data={[
					{
						title: category.data.name
					}
				]} />
				<h1 className="text-3xl font-semibold">
					{`${category.data.name}`}
				</h1>
				{category.data.description && (
					<p className={'mt-3 text-gray-700'}>
						{category.data.description}
					</p>
				)}
			</div>
			<React.Suspense
				fallback={<p className='text-center mx-auto my-8 text-xl'>Loading</p>}
			>
				<PostsList
					postsPromise={postsPromise}
					currentPage={1}
					navLink={`/blog/danh-muc/${params.slug[0]}`}
				/>
			</React.Suspense>
		</>
	)
}
