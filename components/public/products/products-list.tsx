'use client'

import ProductCard from "@/components/public/products/product-card";
import {ArrowLeft, ArrowRight} from "lucide-react";
import {getProducts} from "@/actions/products/queries";
import React, {useState} from "react";
import {useSearchParams} from "next/navigation";
import {searchParamsSchema} from "@/actions/products/validations";
import {Link} from "@/navigation";
import {CgClose} from "react-icons/cg";
import {useSearchProductContext} from "@/components/public/products/search-product-provider";
import {useTranslations} from "next-intl";

export default function ProductsList({productsPromise}: {
	productsPromise: ReturnType<typeof getProducts>,
}){
	const {data, pageCount} = React.use(productsPromise)
	const {filterParams, setFilterParams} = useSearchProductContext()

	const searchParams = useSearchParams()
	const search = searchParamsSchema.parse(Object.fromEntries(searchParams))
	const t = useTranslations();

	return (
		<>
			{Boolean(search.title) && (
				<p className={'text-center mt-4'}>
					{t("search_result", {pageCount})}: <span className={'font-medium bg-yellow-300'}>{search.title}</span><Link className={'inline-flex'} href={'/san-pham'}><CgClose className={'size-4 ml-1 -mb-2'} /></Link>
				</p>
			)}

			<div className={'mt-5'}>
				<div className={'grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-5'}>
					{data.map((product, index) => (
						<ProductCard product={product} key={product.id} size={'sm'} />
					))}
				</div>
				{data.length === 0 &&
					<div className={'text-lg lg:text-xl text-center'}>
						<p>{t("pagination.no_data")}</p>
					</div>
				}
			</div>

			<div className={' mt-10 '}>
				{data.length > 1 && (
					<p className={'text-center mb-4'}>{t("pagination.page")} {filterParams.page}/{pageCount} </p>
				)}
				<div className="text-center flex flex-nowrap items-center justify-center gap-7">
					{filterParams.page > 1 && (
						<div
							onClick={()=>{
								setFilterParams({...filterParams, page: filterParams.page - 1})
							}}
							className={''}
						>
							<div className={'flex bg-[#141414] text-white items-center p-3 cursor-pointer hover:opacity-80 transition'}>
								<ArrowLeft className={'mr-5 size-5'}/> {t("pagination.previous")}
							</div>
						</div>
					)}
					{filterParams.page < pageCount && (
						<div
							onClick={()=>{
								setFilterParams({...filterParams, page: filterParams.page + 1})
							}}
							className={''}
						>
							<div className={'flex bg-[#141414] text-white items-center p-3 cursor-pointer hover:opacity-80 transition'}>
								{t("pagination.next")} <ArrowRight className={'ml-5 size-5'}/>
							</div>
						</div>
					)}
				</div>
			</div>
		</>
	)
}
