import {TPostWithRelation} from "@/actions/posts/validations";
import {Link} from "@/navigation";
import {getDateVn} from "@/lib/date";
import {ArrowRight} from "lucide-react";
import {cn} from "@/lib/utils";
import {CaretRightIcon} from "@radix-ui/react-icons";
import {useLocale, useTranslations} from "next-intl";
import CloudImage from "@/components/CloudImage";

export default function PostCard({post, smallSize}: {
	post: TPostWithRelation,
	smallSize?: boolean
}){
	const t = useTranslations('posts');
	const engVer = useLocale() === 'en'

	if(engVer){
		post.title = (post.langEn as any)?.title || post.title
		post.description = (post.langEn as any)?.description || post.description
	}

	return (
		<div className={'w-full bg-white flex-col justify-start items-start inline-flex'}>
			{post.image && (
				<Link
					href={`/blog/${post.slug}`}
					className={`group relative aspect-[8/5] w-full bg-white overflow-hidden`}
				>
					<CloudImage
						src={post.image} alt={`${post.title}`}
						width={400}
						height={300}
						className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform ease-in-out duration-500"
					/>
				</Link>
			)}

			<div className={'self-stretch flex-col justify-start items-start gap-3 lg:gap-4 flex p-4 lg:p-5'}>
				<h3 className={cn("text-lg font-bold m-0 leading-snug md:leading-snug line-clamp-2 h-12", {
					"": Boolean(smallSize),
					"md:text-2xl": !Boolean(smallSize)
				})}>
					<Link href={`/blog/${post.slug}`} className={'transition-all duration-150 text-cyan-900 hover:text-blue-500'}>
						{post.title}
					</Link>
				</h3>
				{!Boolean(smallSize) && (
					<div className={'self-stretch text-sm font-medium leading-normal tracking-widest'}>
						{engVer ? post.createdAt.toLocaleDateString('en-EN') : getDateVn(post.createdAt, true)}
					</div>
				)}
				<div
					className={cn("self-stretch leading-loose line-clamp-2 group-hover:motion-preset-slide-left motion-delay-300", {
						"lg:text-lg": !Boolean(smallSize)
					})}>
					{post.description}
				</div>
				<Link href={`/blog/${post.slug}`}
				      className={'text-sm transition-all duration-150 text-cyan-900 hover:text-blue-500 flex items-center'}>
					{t('watch_more')} <CaretRightIcon className={'size-3 ml-2'}/>
				</Link>
			</div>
		</div>
	)
}
