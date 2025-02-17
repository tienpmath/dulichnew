import {getPosts} from "@/actions/posts/queries";
import {PostStatus} from ".prisma/client";
import PostsList from "@/components/public/posts/posts-list";
import {notFound} from "next/navigation";
import {Metadata, ResolvingMetadata} from "next";
import siteMetadata from "@/config/siteMetadata";
import {getPostCategories, getPostCategoryBySlug} from "@/actions/posts/categories/queries";
import {POST_PAGINATION} from "@/enum/enums";
import React from "react";
import BreadCrumb from "@/components/public/breadcrumb/breadcrumb";
import Image from "next/image";
import {getLocale, getTranslations} from "next-intl/server";
import BlogCatLayout01 from "@/app/[locale]/(public)/(blog)/blog/danh-muc/_components/blog-cat-layout-01";
import {TSettingSchema} from "@/actions/settings/validations";
import BlogCatLayoutProduct from "@/app/[locale]/(public)/(blog)/blog/danh-muc/_components/blog-cat-layout-product";

type Props = {
	params: { slug: string }
	searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
	{ params }: Props,
	parent: ResolvingMetadata
): Promise<Metadata> {
	const {data, error} = await getPostCategoryBySlug(params.slug[0])

	if(!data || error) {
		return {
			title: 'Not Found'
		}
	}

	return {
		title: `${data.name}`,
		description: `Danh sách bài viết trong danh mục: ${data.name}`,
		openGraph: {
			title: `${data.name}`,
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
// 	const filtered_data = data.filter(tag => tag._count.posts !== 0)
//
// 	return filtered_data.map((tag) => ({
// 		slug: tag.slug,
// 	}))
// }

export default async function Page({params}: Props){
	const category = await getPostCategoryBySlug(params.slug[0])

	if(!category.data || category.error){
		notFound()
	}

	const postsPromise = getPosts({
		page: 1,
		per_page: POST_PAGINATION.PER_PAGE,
		status: PostStatus.PUBLISHED,
		category_slug: params.slug[0],
	})
	
	const catSettingLayout = (category.data?.settings as TSettingSchema[]).find(i => i.name === 'Layout')
	
	if(catSettingLayout?.data[0] === "product"){
		return (
			<BlogCatLayoutProduct
				params={params}
				category={category}
			/>
		)
	}

	return (
		<>
			<BlogCatLayout01
				params={params}
				category={category}
				postsPromise={postsPromise}
			/>
		</>
	)
}
