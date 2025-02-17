import {PostStatus} from ".prisma/client";
import {Metadata} from "next";
import siteMetadata from "@/config/siteMetadata";
import {SearchParams} from "@/types";
import {searchParamsSchema} from "@/actions/posts/validations";
import React from "react";
import {SearchPostProvider} from "@/components/public/posts/search-post-provider";
import {getPosts} from "@/actions/posts/queries";
import SearchPostsList from "@/components/public/posts/search-posts-list";
import {POST_PAGINATION} from "@/enum/enums";
import {useTranslations} from "next-intl";
import {getLocale, getTranslations} from "next-intl/server";

export const metadata: Metadata = {
	title: 'Tìm kiếm bài viết',
	description: `Cập nhật những bài viết mới nhất từ "${siteMetadata.logoTitle}"`,
	openGraph: {
		title: 'Tìm kiếm bài viết',
		description: `Cập nhật những bài viết mới nhất từ "${siteMetadata.logoTitle}"`,
		images: `${siteMetadata.ogImage}`
	}
}

export default async function Page({searchParams}: {
	searchParams: SearchParams
}) {
	const t = await getTranslations();
	const engVer = await getLocale() === 'en'

	const parsedSearchParams = searchParamsSchema.parse(searchParams)
	const postsPromise = getPosts({
		...parsedSearchParams,
		per_page: POST_PAGINATION.PER_PAGE,
		status: PostStatus.PUBLISHED,
		enabledRelated: true,
		langEn: engVer,
	})

	return (
		<>
			<div className={'max-w-4xl container space-y-4'}>
				{parsedSearchParams.page !== 1 ?
					<p className={'text-center'}>{`${t('pagination.page')} ${parsedSearchParams.page}`}</p> : ''}
				<h1 className="text-xl font-bold text-center">
					{t('posts.search')}
				</h1>
			</div>

			<React.Suspense
				fallback={<p className='text-center mx-auto my-8 text-xl'>Loading</p>}
			>
				<SearchPostProvider>
					<SearchPostsList
						postsPromise={postsPromise}
					/>
				</SearchPostProvider>
			</React.Suspense>
		</>
	)
}
