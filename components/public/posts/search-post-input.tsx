import {Input} from "@/components/ui/input";
import React, {useState} from "react";
import _ from "lodash";
import {useSearchPostContext} from "@/components/public/posts/search-post-provider";
import {useTranslations} from "next-intl";

export default function SearchPostInput(){
	const {filterParams, setFilterParams} = useSearchPostContext()

	const onTitleChange = (e: any) => {
		setFilterParams({
			...filterParams,
			page: 1,
			title: e.target.value,
		})
	}
	const debouncedOntTitleChange = _.debounce(onTitleChange, 200)
	const t = useTranslations();

	return (
		<Input
			type={'search'}
			placeholder={t("search")}
			className="h-12 text-lg max-w-md mx-auto bg-white border border-opacity-50 border-indigo-200"
			defaultValue={filterParams.title}
			onChange={debouncedOntTitleChange}
		/>
	)
}
