'use client'
import PostCard from "@/components/public/posts/post-card";
import {ArrowLeft, ArrowRight} from "lucide-react";
import {getPosts} from "@/actions/posts/queries";
import React from "react";
import {useSearchPostContext} from "@/components/public/posts/search-post-provider";
import SearchPostInput from "@/components/public/posts/search-post-input";
import {useTranslations} from "next-intl";
import {Link} from "@/navigation";
import {CgClose} from "react-icons/cg";

export default function SearchPostsList({postsPromise}: {
	postsPromise: ReturnType<typeof getPosts>,
}){
	const {data, pageCount} = React.use(postsPromise)
	const {filterParams, setFilterParams} = useSearchPostContext()
	const t = useTranslations();

	return (
		<>
			<div className={'container '}>
				<SearchPostInput/>
				{Boolean(filterParams.title) && (
					<p className={'text-center mt-4'}>
						{t("search_result", {pageCount})}: <span className={'font-medium bg-yellow-300'}>{filterParams.title}</span><Link className={'inline-flex'} href={'/san-pham'}><CgClose className={'size-4 ml-1 -mb-2'} /></Link>
					</p>
				)}
			</div>

			<div className={'container'}>
				<div className={'grid md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-5'}>
					{data.map((post, index) => (
						<PostCard post={post} key={post.id} smallSize/>
					))}
				</div>
				{data.length === 0 &&
					<div className={'text-lg lg:text-xl text-center'}>
						<p>{t("pagination.no_data")}</p>
					</div>
				}
			</div>

			<div className={'container '}>
				{data.length > 1 && (
					<p className={'text-center mb-4'}>{t("pagination.page")} {filterParams.page}/{pageCount} </p>
				)}
				<div className="text-center flex flex-nowrap items-center justify-center gap-7">
					{filterParams.page > 1 && (
						<div
							onClick={()=>{
								setFilterParams({...filterParams, page: filterParams.page - 1})
							}}
							className={''}
						>
							<div className={'flex bg-[#141414] text-white items-center p-3 cursor-pointer hover:opacity-80 transition'}>
								<ArrowLeft className={'mr-5 size-5'}/> {t("pagination.previous")}
							</div>
						</div>
					)}
					{filterParams.page < pageCount && (
						<div
							onClick={()=>{
								setFilterParams({...filterParams, page: filterParams.page + 1})
							}}
							className={''}
						>
							<div className={'flex bg-[#141414] text-white items-center p-3 cursor-pointer hover:opacity-80 transition'}>
								{t("pagination.next")} <ArrowRight className={'ml-5 size-5'}/>
							</div>
						</div>
					)}
				</div>
			</div>
		</>
	)
}

