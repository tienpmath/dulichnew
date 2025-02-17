'use client'

import React, {useState} from "react";
import _ from "lodash";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {SearchIcon} from "lucide-react";
import {useTranslations} from "next-intl";
import {useRouter} from "@/navigation";

export function SearchInput() {
	const router = useRouter()

	const [term, setTerm] = useState('')
	const onTitleChange = (e: any) => {
		setTerm(e.target.value)
	}
	const debouncedOntTitleChange = _.debounce(onTitleChange, 200)
	const t = useTranslations();

	return (
		<form onSubmit={(e)=>{
			e.preventDefault()
			router.push(`/blog/tim-kiem?title=${term}`)

		}} className="flex items-center justify-center w-fit mx-auto gap-2">
			<Input
				type={'search'}
				placeholder={t("search")}
				className="h-12 text-lg w-80 mx-auto bg-white border border-opacity-50 border-indigo-200"
				onChange={debouncedOntTitleChange}
			/>
			<div>
				<Button type={'submit'} size={'icon'} className={'h-12 w-12'} variant={'primary'}>
					<SearchIcon/>
				</Button>
			</div>
		</form>
	)
}
