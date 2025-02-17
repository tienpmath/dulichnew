'use client'

import React, {createContext, useContext, useState} from "react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {searchParamsSchema} from "@/actions/products/validations";
import {router} from "next/client";

type TSearchValues = {
	filterParams: {
		page: number,
		title: string | undefined,
		variants: string | undefined
	}
	setFilterParams: React.Dispatch<React.SetStateAction<{ page: number, title: string | undefined, variants: string | undefined}>>
}

const initValues: TSearchValues = {
	filterParams: {
		page: 1,
		title: '',
		variants: '',
	},
	setFilterParams: () => undefined,
}

const SearchContext = createContext(initValues)

export const SearchProductProvider = (props: {children: React.ReactNode}) => {
	const router = useRouter()
	const pathname = usePathname()

	const searchParams = useSearchParams()
	const search = searchParamsSchema.parse(Object.fromEntries(searchParams))

	const [filterParams, setFilterParams] = useState({
		page: search.page,
		title: search.title,
		variants: search.variants,
	})

	// Create query string
	const createQueryString = React.useCallback(
		(params: Record<string, string | number | null>) => {
			const newSearchParams = new URLSearchParams(searchParams?.toString())

			for (const [key, value] of Object.entries(params)) {
				if (value === null) {
					newSearchParams.delete(key)
				} else {
					newSearchParams.set(key, String(value))
				}
			}

			return newSearchParams.toString()
		},
		[searchParams]
	)

	React.useEffect(() => {
		router.push(
			`${pathname}?${createQueryString({
				page: filterParams.page,
			})}`, {
				scroll: false
			}
		)
	}, [filterParams.page])

	React.useEffect(() => {
		router.push(
			`${pathname}?${createQueryString({
				title: filterParams.title || null,
				page: filterParams.page,
			})}`, {
				scroll: false
			}
		)
	}, [filterParams.title])

	return <SearchContext.Provider value={{
		filterParams,
		setFilterParams
	}}>
		{props.children}
	</SearchContext.Provider>
}

export const useSearchProductContext = () => {
	return useContext(SearchContext)
}
