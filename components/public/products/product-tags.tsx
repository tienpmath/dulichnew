import {Link} from "@/navigation";
import {TProductWithRelation} from "@/actions/products/validations";

export default function ProductTags({data}: {data: TProductWithRelation}){
	if(data.tags.length === 0) return <></>
	return (
		<div className={'max-w-3xl mx-auto w-full flex gap-4 px-6 py-5 border border-gray-500 border-opacity-80 border-dashed rounded-2xl'}>
			<div className={'font-bold text-lg'}>Tags:</div>
			<div className="flex gap-2 flex-wrap">
				{data.tags.map(tag => (
					<Link href={`/san-pham/tags/${tag.slug}`} key={tag.id} className={'rounded-full p-1 px-2 text-sm font-bold bg-yellow-200 hover:bg-yellow-300 transition-colors'}>
						#{tag.name}
					</Link>
				))}
			</div>
		</div>
	)
}
