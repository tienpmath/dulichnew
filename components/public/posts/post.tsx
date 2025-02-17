import {TPostWithRelation} from "@/actions/posts/validations";

import Image from "next/image";
import {Link} from "@/navigation";
import RelatedLinks from "@/app/[locale]/(public)/_components/related-links";
import PostTags from "@/components/public/posts/post-tags";
import {parseLinkJson} from "@/actions/common/ralated-link-schema";
import RelatedPostsPromise from "@/components/public/posts/related-posts-promise";
import BreadCrumb from "@/components/public/breadcrumb/breadcrumb";
import _ from "lodash";
import * as React from "react";
import {getLocale, getTranslations} from "next-intl/server";
import CloudImage from "@/components/CloudImage";
import {TSettingSchema} from "@/actions/settings/validations";

import BgYoutubeVideo from "@/components/public/video-player/bg-youtube-video";
import dynamic from 'next/dynamic';

// const BgYoutubeVideo = dynamic(() => import('@/components/public/video-player/bg-youtube-video'), {
// 	ssr: true,
// 	loading: () => <p>Loading...</p>,
// });

import {cn} from "@/lib/utils";
import {getDateVn} from "@/lib/date";
const PostBody = dynamic(() => import("@/components/public/posts/post-body"), {
	ssr: false,
});

export default function Post({data}: {
	data: TPostWithRelation
}){
	const locale = React.use(getLocale())
	const t = React.use(getTranslations())
	const engVer = locale === 'en'

	if(engVer){
		data.title = (data.langEn as any)?.title || data.title
		data.description = (data.langEn as any)?.description || data.description
		data.body = (data.langEn as any)?.body || data.body
		data.relatedLinks = (data.langEn as any)?.relatedLinks || data.relatedLinks
	}

	function PostFeature(){
		const videoSetting = (data?.settings as TSettingSchema[]).find(i => i.name === 'Youtube Video ID')
		const videoSettingID = videoSetting?.data[0]

		if(videoSettingID) {
			return (
				<div
					className={'blog-item p-7 border border-indigo-200 border-opacity-50 max-w-[95vw] w-full relative'}>
					{videoSetting.data.map(((item, index) => (
						<div
							key={index}
							className={cn('rounded-md block mb-0 w-full overflow-hidden aspect-video relative',
							)}
						>
							<BgYoutubeVideo videoId={item} muted={0}/>
						</div>
					)))}
				</div>
			)
		}

		return (
			<>
				{data.image && (
					<div className={'blog-item p-7 border border-indigo-200 border-opacity-50 max-w-[95vw] w-full'}>
						<div className="vweb-image">
							<picture className={'rounded-md block mb-0 w-full overflow-hidden aspect-[14/7] relative'}>
								<CloudImage
									width={1200}
									height={800}
									src={data.image} alt={`${data.title}`} className={'object-center object-cover w-full h-full'}
								/>
							</picture>
						</div>
					</div>
				)}
			</>
		)
	}

	return (
		<>
			<div className="container max-w-3xl px-5">
				<BreadCrumb
					data={[
						{
							title: 'Blog',
							href:'/blog'
						},
						{
							title: data.title
						}
					].filter(i => !_.isEmpty(i))}
				/>
			</div>

			<article className="container mx-auto grid grid-cols-1 gap-8 justify-items-center">
				<div className={'max-w-3xl w-full mx-auto grid grid-cols-1 gap-7 px-5'}>
					<h1 className={'~text-2xl/4xl font-bold text-cyan-900 !leading-tight'}>{data.title}</h1>
					<hr className={'gradient-line'}/>
					<div>
						<span className="text-sm font-medium leading-normal tracking-widest">{engVer ? data.createdAt.toLocaleDateString('en-EN')  : getDateVn(data.createdAt)}</span>
					</div>
				</div>
				<PostFeature/>
				<PostBody data={data}/>
				<RelatedLinks data={parseLinkJson(data.relatedLinks)}/>
				<PostTags data={data}/>
			</article>

			<RelatedPostsPromise/>
		</>
	)
}
