import {getPosts, getRandomPublishedPosts} from "@/actions/posts/queries";
import React from "react";
import {Button} from "@/components/ui/button";
import {Link} from "@/navigation";
import {ArrowLeft} from "lucide-react";
import PostsCarousel from "@/components/public/posts/posts-carousel";
import PostCard from "@/components/public/posts/post-card";
import {useTranslations} from "next-intl";

export default function RelatedPosts(props :{
	postsPromise: ReturnType<typeof getRandomPublishedPosts>
}){
	const {data} = React.use(props.postsPromise)
	const t = useTranslations('posts');

	return (
		<div className={'container'}>
			<div className={'mb-3 p-5 rounded-t-md'}>
				<h3 className={'text-xl font-bold uppercase'}>{t("related")}</h3>
			</div>
			{Number(data?.length) <= 3 ? (
				<div className={'grid md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-5'}>
					{data?.map((post, index) => (
						<PostCard post={post} key={post.id} smallSize />
					))}
				</div>
			) : (
				<div className={'-mx-5'}>
					<PostsCarousel data={data}/>
				</div>
			)}
			<div className={'my-10 text-center flex items-center justify-center'}>
				<Button variant={'dark-destructive'} className={'rounded-xl uppercase'} size={'lg'} asChild>
					<Link href={'/blog'}>
						<ArrowLeft className={'size-4 mr-1'}/> {t("all")}
					</Link>
				</Button>
			</div>
		</div>
	)
}
