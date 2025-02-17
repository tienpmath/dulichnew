import {getPosts} from "@/actions/posts/queries";
import {PostStatus} from ".prisma/client";
import PostsList from "@/components/public/posts/posts-list";
import {getPostTag, getPostTags, getPostTagBySlug} from "@/actions/posts/tags/queries";
import {notFound} from "next/navigation";
import {Metadata, ResolvingMetadata} from "next";
import siteMetadata from "@/config/siteMetadata";
import {POST_PAGINATION} from "@/enum/enums";
import React from "react";

type Props = {
	params: { slug: string }
	searchParams: { [key: string]: string | string[] | undefined }
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
		title: `Tag bài viết: ${data.name}`,
		description: `Danh sách bài viết với tag: ${data.name}`,
		openGraph: {
			title: `Tag bài viết: ${data.name}`,
			description: `Danh sách bài viết với tag: ${data.name}`,
			images: `${siteMetadata.ogImage}`
		}
	}
}

// export async function generateStaticParams() {
// 	const {data, pageCount} = await getPostTags({
// 		page: 1,
// 		per_page: 1000,
// 	})
// 	const tags = data.filter(tag => tag._count.posts !== 0)
//
// 	return tags.map((tag) => ({
// 		slug: tag.slug,
// 	}))
// }

export default async function Page({params}: Props){
	const tag = await getPostTagBySlug(params.slug)

	if(!tag.data || tag.error){
		notFound()
	}

	const postsPromise = getPosts({
		page: 1,
		per_page: POST_PAGINATION.PER_PAGE,
		status: PostStatus.PUBLISHED,
		// tagId: tag.data.id,
		tag_slug: params.slug,
		enabledRelated: true,
	})

	return (
		<>
			<div className={'max-w-4xl container space-y-4'}>
				<h1 className="text-xl font-bold text-center">
					{`Tag: ${tag.data.name}`}
				</h1>
			</div>
			<React.Suspense
				fallback={<p className='text-center mx-auto my-8 text-xl'>Loading</p>}
			>
				<PostsList
					postsPromise={postsPromise}
					currentPage={1}
					navLink={`/blog/tags/${params.slug}`}
				/>
			</React.Suspense>
		</>
	)
}
