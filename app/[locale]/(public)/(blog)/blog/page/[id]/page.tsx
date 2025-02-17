import { getPosts} from "@/actions/posts/queries";
import {PostStatus} from ".prisma/client";
import PostsList from "@/components/public/posts/posts-list";
import {Metadata, ResolvingMetadata} from "next";
import siteMetadata from "@/config/siteMetadata";
import {POST_PAGINATION} from "@/enum/enums";
import React from "react";
import {searchParamsSchema} from "@/actions/products/validations";
import {useTranslations} from "next-intl";
import {getTranslations} from "next-intl/server";

type Props = {
	params: { id: string }
}

export async function generateMetadata(
	{ params }: Props,
	parent: ResolvingMetadata
): Promise<Metadata> {

	return {
		title: `Blog - Trang ${params.id}`,
		description: `Cập nhật những bài viết mới nhất từ "${siteMetadata.logoTitle}"`,
		openGraph: {
			title: `Blog - Trang ${params.id}`,
			description: `Cập nhật những bài viết mới nhất từ "${siteMetadata.logoTitle}"`,
			images: `${siteMetadata.ogImage}`
		}
	}
}

// export async function generateStaticParams() {
// 	const {data, pageCount} = await getPosts({
// 		page: 1,
// 		per_page: POST_PAGINATION.PER_PAGE,
// 		status: PostStatus.PUBLISHED,
// 		enabledRelated: true,
// 	})
//
// 	return Array.from(Array(pageCount).keys()).map((page) => ({
// 		id: String(page+1),
// 	}))
// }

export default async function Page({params}: Props) {
	const postsPromise = getPosts({
		page: Number(params.id),
		per_page: POST_PAGINATION.PER_PAGE,
		status: PostStatus.PUBLISHED,
		enabledRelated: true,
	})
	const t = await getTranslations();

	return (
		<>
			<div className={'max-w-4xl container space-y-4'}>
				{Number(params.id) !== 1 ? <p className={'text-center'}>{`${t('pagination.page')} ${params.id}`}</p> : ''}
				<h1 className="text-xl font-bold text-center">
					{t("posts.newest")}
				</h1>
			</div>
			<React.Suspense
				fallback={<p className='text-center mx-auto my-8 text-xl'>Loading</p>}
			>
				<PostsList postsPromise={postsPromise} currentPage={Number(params.id)} enabledSearch/>
			</React.Suspense>
		</>
	)
}
