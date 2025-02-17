import {getPosts} from "@/actions/posts/queries";
import {PostStatus} from ".prisma/client";
import PostsList from "@/components/public/posts/posts-list";
import {Metadata} from "next";
import siteMetadata from "@/config/siteMetadata";
import {POST_PAGINATION} from "@/enum/enums";
import React from "react";
import {getTranslations} from "next-intl/server";

export const metadata: Metadata = {
	title: 'Blog',
	description: `Cập nhật những bài viết mới nhất từ "${siteMetadata.logoTitle}"`,
	openGraph: {
		title: 'Blog',
		description: `Cập nhật những bài viết mới nhất từ "${siteMetadata.logoTitle}"`,
		images: `${siteMetadata.ogImage}`
	}
}

export default async function Page() {
	const postsPromise = getPosts({
		page: 1,
		per_page: POST_PAGINATION.PER_PAGE,
		status: PostStatus.PUBLISHED,
		enabledRelated: true,
	})
	const t = await getTranslations();

	return (
		<>
			<div className={'max-w-4xl container space-y-4'}>
				<h1 className="text-xl font-bold text-center">
					{t("posts.newest")}
				</h1>
			</div>
			<React.Suspense
				fallback={<p className='text-center mx-auto my-8 text-xl'>Loading</p>}
			>
				<PostsList postsPromise={postsPromise} currentPage={1} enabledSearch/>
			</React.Suspense>
		</>
	)
}
