'use client'

import React, {Fragment, useEffect, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {TProductCategory} from "@/actions/products/categories/validations";
import {Checkbox} from "@/components/ui/checkbox";
import _ from "lodash";
import {useSearchProductContext} from "@/components/public/products/search-product-provider";
import {searchParamsSchema} from "@/actions/products/validations";
import {cn} from "@/lib/utils";
import {useLocale} from "next-intl";

export function FilterProductCategory(props: {
	category: TProductCategory | null
}) {
	const router = useRouter()
	const searchParams = useSearchParams()
	const search = searchParamsSchema.parse(Object.fromEntries(searchParams))
	const engVer = useLocale() === 'en'

	const createQueryString = (params: Record<string, string | number | null>) => {
		const newSearchParams = new URLSearchParams(searchParams?.toString())

		for (const [key, value] of Object.entries(params)) {
			if (value === null) {
				newSearchParams.delete(key)
			} else {
				newSearchParams.set(key, String(value))
			}
		}

		return newSearchParams.toString()
	}

	const [filters, setFilters] = useState((props.category?.variants as any[])?.reduce((prev, cur) => ({...prev,
		[cur.slug]: []
	}), {}) || {})

	useEffect(() => {
		if(search.variants){
			const data = JSON.parse(decodeURIComponent(search.variants || ""))

			const temp = {...filters}
			if(typeof data === "object") {
				Object.keys(data).forEach(k => {
					if(Object.keys(filters).find(i => i===k)){
						temp[k] = data[k]
					}
				})
			}
			setFilters(temp)
		}
	}, [])

	return (
		<>
			{(props.category?.variants as any[]).filter(v => !Boolean(v.hidden)).map((variant, index) => (
				<Fragment key={index}>
					<div className={''}>
						<h4 className={'font-bold text-lg text-cyan-900 mb-2'}>
							{engVer ? variant?.langEnName || variant?.name : variant?.name}
						</h4>
						<div className="divide-y divide-zinc-400/30 text-sm">
							{(variant.value as string[]).map((variant_value, i) => {
								const isColor = variant.slug === 'color'
								return (
									<div
										key={i}
										className={cn("flex items-center space-x-2 py-3", {
											"relative": isColor
										})}
									>
										<Checkbox
											className={cn(isColor ? 'hidden' : 'border border-gray-300 hover:border-red-500 rounded-none data-[state=checked]:bg-red-600 data-[state=checked]:border-red-500')}
											id={`v_${index}_${i}`}
											checked={_.includes(filters[variant.slug], variant_value)}
											onCheckedChange={(v) => {
												const temp: any = {...filters}
												if(v) {
													temp[variant.slug].push(variant_value)
												} else {
													const index = temp[variant.slug].findIndex(i => i === variant_value)
													temp[variant.slug].splice(index, 1)
												}
												setFilters(temp)

												const t = _.omitBy(temp, _.isEmpty)

												router.push(`?${createQueryString({
													variants: !_.isEmpty(t) ? encodeURIComponent(JSON.stringify(t)) : null,
													page: null,
													title: null
												})}`, {scroll: false})
											}}
										/>
										{Boolean(isColor) && (
											<label
												htmlFor={`v_${index}_${i}`}
												className={cn("size-7 block cursor-pointer hover:opacity-80 transition-all", {
													"rotate-[30deg]": _.includes(filters[variant.slug], variant_value)
												})}
												style={{backgroundColor: variant.value_options[i]}}
											>
											</label>
										)}
										<label
											htmlFor={`v_${index}_${i}`}
											className="text-sm cursor-pointer hover:opacity-80 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
										>
											{engVer ? variant?.langEnValue ? variant?.langEnValue[i] || variant_value : variant_value  : variant_value}
										</label>
									</div>
								)
							})}
						</div>
					</div>
				</Fragment>
			))}
		</>
	)
}
