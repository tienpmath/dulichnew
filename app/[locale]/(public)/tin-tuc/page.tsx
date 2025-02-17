import {getSettingBySlug} from "@/actions/settings/queries";
import * as React from "react";
import {getTranslations} from "next-intl/server";
import {getPosts} from "@/actions/posts/queries";
import {PostStatus} from ".prisma/client";
import PostsCarousel2 from "@/components/public/posts/posts-carousel-2";

export default async function Page(){
	const {data: setting} = await getSettingBySlug('home-page')
	const t = await getTranslations();
	const promotion = await getPosts({
		page: 1,
		per_page: 8,
		status: PostStatus.PUBLISHED,
		// enabledRelated: true,
		// image: "http~contains",
		category_slug: 'tin-khuyen-mai'
	})
	const camNang = await getPosts({
		page: 1,
		per_page: 8,
		status: PostStatus.PUBLISHED,
		// enabledRelated: true,
		// image: "http~contains",
		category_slug: 'cam-nang'
	})
	const congTrinh = await getPosts({
		page: 1,
		per_page: 8,
		status: PostStatus.PUBLISHED,
		// enabledRelated: true,
		// image: "http~contains",
		category_slug: 'cong-trinh-thuc-te'
	})
	const daiLy = await getPosts({
		page: 1,
		per_page: 8,
		status: PostStatus.PUBLISHED,
		// enabledRelated: true,
		// image: "http~contains",
		category_slug: 'dai-ly-chinh-hang'
	})
	
	return (
		<>
			<div className="min-h-[50vh] container grid grid-cols-1 justify-start ~gap-8/12 ~pb-10/16">
				<h1 className="text-3xl font-semibold capitalize">{t("news.heading")}</h1>
				
				<div className="flex flex-col ~gap-10/16 ">
					{promotion.data.length > 0 && (
						<div>
							<h2 className={'~text-xl/2xl font-semibold block w-fit mb-5 capitalize'}>
								{t("news.promotion")}
							</h2>
							<PostsCarousel2 basis={3} data={promotion.data || []}/>
						</div>
					)}
					{camNang.data.length > 0 && (
						<div>
							<h2 className={'~text-xl/2xl font-semibold block w-fit mb-5 capitalize'}>
								{t("news.product_manual")}
							</h2>
							<PostsCarousel2 basis={3} data={camNang.data || []}/>
						</div>
					)}
					{congTrinh.data.length > 0 && (
						<div>
							<h2 className={'~text-xl/2xl font-semibold block w-fit mb-5 capitalize'}>
								{t("news.project")}
							</h2>
							<PostsCarousel2 basis={3} data={congTrinh.data || []}/>
						</div>
					)}
					{daiLy.data.length > 0 && (
						<div>
							<h2 className={'~text-xl/2xl font-semibold block w-fit mb-5 capitalize'}>
								{t("news.dealer")}
							</h2>
							<PostsCarousel2 basis={3} data={daiLy.data || []}/>
						</div>
					)}
				</div>
			
			</div>
		</>
	)
}
