import '@/styles/quill/quill.css'
import {cn} from "@/lib/utils";

export default function DisplayProse({content, className}: {
	content: string,
	className?: string
}){
	return (
		<div
			className={cn('prose max-w-none w-full break-words ql-snow prose-img:w-auto prose-img:h-auto', className)}
		>
			<div
				dangerouslySetInnerHTML={{__html: String(content)}}
			/>
		</div>
	)
}
