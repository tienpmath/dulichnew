import PostCard from "@/components/public/posts/post-card";
import {Link} from "@/navigation";
import {ArrowLeft, ArrowRight} from "lucide-react";
import {getPosts} from "@/actions/posts/queries";
import React from "react";
import {notFound} from "next/navigation";
import {SearchInput} from "@/components/public/posts/search-input";
import {getTranslations} from "next-intl/server";

export default function PostsList({postsPromise, currentPage, listTitle, navLink, enabledSearch}: {
	postsPromise: ReturnType<typeof getPosts>,
	currentPage: number,
	listTitle?: string,
	navLink?: string,
	enabledSearch?: boolean
}){
	const {data, pageCount} = React.use(postsPromise)

	if(!data || data.length === 0){
		notFound()
	}
	const t = React.use(getTranslations());

	return (
		<>
			{Boolean(enabledSearch) && (
				<div className={'container '}>
					<SearchInput/>
				</div>
			)}

			<div className={'container'}>
				<div className={'grid md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-5'}>
					{data.map((post, index) => (
						<PostCard post={post} key={post.id} smallSize />
					))}
				</div>
			</div>

			{pageCount > 1 && (
				<div className={'container text-center flex flex-nowrap items-center justify-center gap-7'}>
					{currentPage > 1 && (
						<Link href={`${navLink ? navLink : '/blog'}/page/${currentPage-1}`} className={''}>
							<span className={'flex bg-[#141414] text-white items-center p-3 cursor-pointer hover:opacity-80 transition'}>
								<ArrowLeft className={'mr-5 size-5'}/> {t("pagination.previous")}
							</span>
						</Link>
					)}
					{currentPage < pageCount && (
						<Link href={`${navLink ? navLink : '/blog'}/page/${currentPage+1}`} className={''}>
							<span className={'flex bg-[#141414] text-white items-center p-3 cursor-pointer hover:opacity-80 transition'}>
								{t("pagination.next")} <ArrowRight className={'ml-5 size-5'}/>
							</span>
						</Link>
					)}
				</div>
			)}
		</>
	)
}

