import { getPosts} from "@/actions/posts/queries";
import {PostStatus} from ".prisma/client";
import PostsList from "@/components/public/posts/posts-list";
import {Metadata, ResolvingMetadata} from "next";
import {notFound} from "next/navigation";
import siteMetadata from "@/config/siteMetadata";
import {getPostCategories, getPostCategoryBySlug} from "@/actions/posts/categories/queries";
import {POST_PAGINATION} from "@/enum/enums";
import React from "react";
import Image from "next/image";
import BreadCrumb from "@/components/public/breadcrumb/breadcrumb";
import {useTranslations} from "next-intl";
import {getLocale, getTranslations} from "next-intl/server";

type Props = {
	params: { slug: string, id: string }
}

export async function generateMetadata(
	{ params }: Props,
	parent: ResolvingMetadata
): Promise<Metadata> {
	const {data, error} = await getPostCategoryBySlug(params.slug)

	if(!data || error) {
		return {
			title: 'Not Found'
		}
	}

	return {
		title: `Trang ${params.id} | Danh mục bài viết: ${data.name}`,
		description: `Danh sách bài viết trong danh mục: ${data.name}`,
		openGraph: {
			title: `Trang ${params.id} | Danh mục bài viết: ${data.name}`,
			description: `Danh sách bài viết trong danh mục: ${data.name}`,
			images: `${siteMetadata.ogImage}`
		}
	}
}

// export async function generateStaticParams() {
// 	const {data, pageCount} = await getPostCategories({
// 		page: 1,
// 		per_page: 1000,
// 	})
//
// 	const filtered_data = data.filter(tag => tag._count.posts !== 0)
//
// 	const pageCounts = {}
// 	for (const item of filtered_data) {
// 		const {pageCount} = await getPosts({
// 			page: 1,
// 			per_page: POST_PAGINATION.PER_PAGE,
// 			status: PostStatus.PUBLISHED,
// 			category_slug: item.slug,
// 			enabledRelated: true,
// 		})
// 		pageCounts[item.slug] = pageCount
// 	}
//
// 	return filtered_data.map((item) => {
// 		return Array.from(Array(pageCounts[item.slug]).keys()).map((page) => ({
// 			slug: item.slug,
// 			id: String(page+1)
// 		}))
// 	})
// }

export default async function Page({params}: Props) {
	const category = await getPostCategoryBySlug(params.slug)

	if (!category.data || category.error) {
		notFound()
	}

	const postsPromise = getPosts({
		page: Number(params.id),
		per_page: POST_PAGINATION.PER_PAGE,
		status: PostStatus.PUBLISHED,
		category_slug: params.slug,
	})

	const t = await getTranslations();
	const engVer = await getLocale() === 'en'

	if(engVer){
		category.data.name = (category.data.langEn as any)?.name || category.data.name
		category.data.description = (category.data.langEn as any)?.description
	}

	return (
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
				{Number(params.id) !== 1 ? <p className={''}>{`${t('pagination.page')} ${params.id}`}</p> : ''}
			</div>
			<React.Suspense
				fallback={<p className='text-center mx-auto my-8 text-xl'>Loading</p>}
			>
				<PostsList
					postsPromise={postsPromise}
					currentPage={Number(params.id)}
					navLink={`/blog/danh-muc/${params.slug}`}
				/>
			</React.Suspense>
		</>
	)
}
