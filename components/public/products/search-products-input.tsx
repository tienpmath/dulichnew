'use client'

import React, {useState} from "react";
import _ from "lodash";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {SearchIcon} from "lucide-react";
import {useTranslations} from "next-intl";
import {useRouter} from "@/navigation";

export function SearchProductsInput() {
	const t = useTranslations();

	const router = useRouter()

	const [term, setTerm] = useState('')
	const onTitleChange = (e: any) => {
		setTerm(e.target.value)
	}
	const debouncedOntTitleChange = _.debounce(onTitleChange, 200)

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault()
				router.push(`/san-pham?title=${term}`)
			}}
			className="flex items-center justify-center w-fit mx-auto focus-within:border focus-within:border-opacity-50 focus-within:border-indigo-500 bg-white border border-opacity-50 border-indigo-200"
		>
			<Input
				type={'search'}
				placeholder={t("search")}
				className="h-8 ~w-44/60 mx-auto rounded-none !border-none"
				onChange={debouncedOntTitleChange}
			/>
			<div>
				<Button type={'submit'} size={'icon'}
				        className={'h-8 w-8 bg-gray-300 text-black rounded-none hover:bg-gray-300/80'} variant={'primary'}>
					<SearchIcon className={'size-4'}/>
				</Button>
			</div>
		</form>
	)
}
