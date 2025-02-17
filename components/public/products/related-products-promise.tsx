import {getProducts, getRandomPublishedProducts} from "@/actions/products/queries";
import RelatedProducts from "@/components/public/products/related-products";
import * as React from "react";
import {ProductStatus} from ".prisma/client";
import {getProductCategoryBySlug} from "@/actions/products/categories/queries";

export default async function RelatedProductsPromise(props: {catSlug: string}){
	const category = await getProductCategoryBySlug(props.catSlug)
	
	if(!category.data || category.error){
		return <></>
	}
	
	const productsPromise = getProducts({
		page: 1,
		per_page: 8,
		status: ProductStatus.PUBLISHED,
		images: [],
		categories: [category.data.id].concat(category.data.childrenCategory.map(c => c.id)).join('.')
	})

	return (
		<RelatedProducts productsPromise={productsPromise}/>
	)
}
