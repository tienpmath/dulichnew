import { getPosts} from "@/actions/posts/queries";
import {PostStatus} from ".prisma/client";
import PostsList from "@/components/public/posts/posts-list";
import {Metadata, ResolvingMetadata} from "next";
import {getPostTags, getPostTagBySlug} from "@/actions/posts/tags/queries";
import {notFound} from "next/navigation";
import siteMetadata from "@/config/siteMetadata";
import {POST_PAGINATION} from "@/enum/enums";
import React from "react";
import {useTranslations} from "next-intl";
import {getTranslations} from "next-intl/server";

type Props = {
	params: { slug: string, id: string }
}

export async function generateMetadata(
	{ params }: Props,
	parent: ResolvingMetadata
): Promise<Metadata> {
	const {data, error} = await getPostTagBySlug(params.slug)

	if(!data || error) {
		return {
			title: 'Not Found'
		}
	}

	return {
		title: `Trang ${params.id} | Tag bài viết: ${data.name}`,
		description: `Danh sách bài viết với tag: ${data.name}`,
		openGraph: {
			title: `Trang ${params.id} | Tag bài viết: ${data.name}`,
			description: `Danh sách bài viết với tag: ${data.name}`,
			images: `${siteMetadata.ogImage}`
		}
	}
}

// export async function generateStaticParams() {
// 	const {data} = await getPostTags({
// 		page: 1,
// 		per_page: 1000,
// 	})
//
// 	const tags = data.filter(tag => tag._count.posts !== 0)
//
// 	const pageCounts = {}
// 	for (const tag of tags) {
// 		const {pageCount} = await getPosts({
// 			page: 1,
// 			per_page: POST_PAGINATION.PER_PAGE,
// 			status: PostStatus.PUBLISHED,
// 			tag_slug: tag.slug,
// 			enabledRelated: true,
// 		})
// 		pageCounts[tag.slug] = pageCount
// 	}
//
// 	return tags.map((tag) => {
// 		return Array.from(Array(pageCounts[tag.slug]).keys()).map((page) => ({
// 			slug: tag.slug,
// 			id: String(page+1)
// 		}))
// 	})
// }

export default async function Page({params}: Props) {
	const tag = await getPostTagBySlug(params.slug)
	const t = await getTranslations();

	if (!tag.data || tag.error) {
		notFound()
	}

	const postsPromise = getPosts({
		page: Number(params.id),
		per_page: POST_PAGINATION.PER_PAGE,
		status: PostStatus.PUBLISHED,
		tag_slug: params.slug,
		enabledRelated: true,
	})

	return (
		<>
			<div className={'max-w-4xl container space-y-4'}>
				{Number(params.id) !== 1 ? <p className={'text-center'}>{`${t('pagination.page')} ${params.id}`}</p> : ''}
				<h1 className="text-xl font-bold text-center">
					{`Tag: ${tag.data.name}`}
				</h1>
			</div>
			<React.Suspense
				fallback={<p className='text-center mx-auto my-8 text-xl'>Loading</p>}
			>
				<PostsList
					postsPromise={postsPromise}
					currentPage={Number(params.id)}
					navLink={`/blog/tags/${params.slug}`}
				/>
			</React.Suspense>
		</>
	)
}
