import {TPostWithRelation} from "@/actions/posts/validations";
import {Link} from "@/navigation";

export default function PostTags({data}: {data: TPostWithRelation}){
	if(data.tags.length === 0) return <></>
	return (
		<div className={'max-w-3xl mx-auto w-full flex gap-4 px-6 py-5 border border-gray-500 border-dashed rounded-2xl'}>
			<div className={'font-bold text-xl'}>Tags:</div>
			<div className="flex gap-2 flex-wrap">
				{data.tags.map(tag => (
					<Link href={`/blog/tags/${tag.slug}`} key={tag.id} className={'rounded-full p-1 px-2 text-sm font-bold bg-yellow-200 hover:bg-yellow-300 transition-colors'}>
						#{tag.name}
					</Link>
				))}
			</div>
		</div>
	)
}
