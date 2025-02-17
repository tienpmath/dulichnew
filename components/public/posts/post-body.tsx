'use client'

import '@/styles/quill/quill.css'
import hljs from "highlight.js";
import 'highlight.js/styles/github-dark-dimmed.min.css'

import CopyButtonPlugin from "highlightjs-copy";
import 'highlightjs-copy/dist/highlightjs-copy.min.css'

import {useEffect, useRef} from "react";
import {TPost} from "@/actions/posts/validations";
import TableOfContent from "@/app/[locale]/(public)/_components/table-of-content";

hljs.addPlugin(new CopyButtonPlugin());
hljs.configure({
	languages: ['html', 'css', 'javascript', 'php', 'python', 'typescript'],
})


export default function PostBody({data}: {
	data: TPost
}){
	const ref = useRef<HTMLDivElement>(null)

	useEffect(()=>{
		const promise = new Promise<void>((resolve, reject) => {
			ref.current?.querySelectorAll('pre:not([data-highlighted])').forEach((el, index, array) => {
				if(el instanceof HTMLElement){
					el.innerHTML = `<code>${el.innerHTML}</code>`
					el.dataset.highlighted = 'true'
				}

				if (index === array.length -1) resolve();
			})
		})

		promise.then(() => {
			hljs.highlightAll()
		})
	}, [])

	return (
		<div
			ref={ref}
			id={'post-body'}
			className={'mx-auto px-5'}
		>
			<TableOfContent/>

			<div
				className={'prose md:prose-lg prose-li:marker:text-gray-500 break-words ql-snow'}
			>
				<div
					dangerouslySetInnerHTML={{__html: String(data.body)}}
				/>
			</div>
		</div>
	)
}
