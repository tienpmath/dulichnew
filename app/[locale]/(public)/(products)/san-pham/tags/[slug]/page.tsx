import {getProductConstants, getProducts} from "@/actions/products/queries";
import {ProductStatus} from ".prisma/client";
import ProductsList from "@/components/public/products/products-list";
import {getProductTag, getProductTags, getProductTagBySlug} from "@/actions/products/tags/queries";
import {notFound} from "next/navigation";
import {Metadata, ResolvingMetadata} from "next";
import siteMetadata from "@/config/siteMetadata";
import {searchParamsSchema} from "@/actions/products/validations";
import React from "react";
import {PRODUCT_PAGINATION} from "@/enum/enums";
import {useTranslations} from "next-intl";
import {getTranslations} from "next-intl/server";

type Props = {
	params: { slug: string }
	searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
	{ params }: Props,
	parent: ResolvingMetadata
): Promise<Metadata> {
	const {data, error} = await getProductTagBySlug(params.slug)

	if(!data || error) {
		return {
			title: 'Not Found'
		}
	}

	return {
		title: `Tag sản phẩm: ${data.name}`,
		description: `Danh sách sản phẩm với tag: ${data.name}`,
		openGraph: {
			title: `Tag sản phẩm: ${data.name}`,
			description: `Danh sách sản phẩm với tag: ${data.name}`,
			images: `${siteMetadata.ogImage}`
		}
	}
}

export default async function Page({params, searchParams}: Props){
	const t = await getTranslations();

	const tag = await getProductTagBySlug(params.slug)

	if(!tag.data || tag.error){
		notFound()
	}

	const parsedSearchParams = searchParamsSchema.parse(searchParams)
	const productsPromise = getProducts({
		...parsedSearchParams,
		per_page: PRODUCT_PAGINATION.PER_PAGE,
		status: ProductStatus.PUBLISHED,
		tag_slug: params.slug,
	})

	return (
		<div className={'container'}>
			<div className={'mt-4'}>
				{parsedSearchParams.page !== 1 ? <p className={'text-center'}>{`${t('pagination.page')} ${parsedSearchParams.page}`}</p> : ''}
				<h1 className="container text-center text-xl font-bold m-0">
					Tag: {tag.data.name}
				</h1>
			</div>

			<React.Suspense
				fallback={<p className='text-center mx-auto my-8 text-xl'>Loading</p>}
			>
				<ProductsList
					productsPromise={productsPromise}
				/>
			</React.Suspense>
		</div>
	)
}
