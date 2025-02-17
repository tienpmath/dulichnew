"use server";

import prisma from "@/lib/prisma";
import {TProductCategory, TProductCategoryGetPayload} from "@/actions/products/categories/validations";
import {Prisma} from ".prisma/client";
import ProductCategoryWhereInput = Prisma.ProductCategoryWhereInput;
import { filterColumn } from "@/lib/filter-column";
import _ from "lodash";
import {getErrorMessage} from "@/lib/handle-error";
import {TProductTag} from "@/actions/products/tags/validations";
import {TGetCategoriesSchema} from "@/actions/common/category-schema";

export async function getProductCategory(id: string) {
	try {
		const res = await prisma.productCategory.findUnique({where: {id}});
		return {
			data: res,
			error: null,
		}
	} catch (e) {
		if (JSON.stringify(e).includes('12 bytes')) {
			return {
				data: null,
				error: 'ID không tồn tại',
			}
		}
		return {
			data: null,
			error: getErrorMessage(e),
		}
	}
}
export async function getProductCategoryBySlug(slug: string): Promise<{data: TProductCategoryGetPayload | null, error: string | null}> {
	try {
		const res = await prisma.productCategory.findUnique({
			where: {
				slug: slug
			},
			include: {
				parentCategory: true,
				childrenCategory: true
			}
		});
		return {
			data: res,
			error: null
		}
	} catch (e) {
		console.log(e)
		return {
			data: null,
			error: getErrorMessage(e),
		}
	}
}
export async function getProductCategories(
	input: TGetCategoriesSchema
) {
	const {
		name,
		slug,

		page,
		per_page,
		sort,
		operator,
	} = input

	// sort
	const [column, order] = (sort?.split(".").filter(Boolean) ?? [
		"name",
		"desc",
	]) as [keyof TProductCategory | undefined, "asc" | "desc" | undefined]

	// where
	const expressions: ProductCategoryWhereInput[] = [
		name
			? filterColumn({
				column: 'name',
				value: name,
			})
			: {},
		slug
			? filterColumn({
				column: 'slug',
				value: slug,
			})
			: {},
	].filter((i) => !_.isEmpty(i))
	const where =
		!operator || operator === "and" ? {AND: expressions} : {OR: expressions}

	try {
		const [total, data] = await prisma.$transaction([
			prisma.productCategory.count({
				where: where,
			}),
			prisma.productCategory.findMany({
				take: per_page,
				skip: (page - 1) * per_page,
				select: {
					id: true,
					slug: true,
					name: true,
					image: true,
					description: true,
					variants: true,
					settings: true,
					hiddenAtSidebar: true,
					langEn: true,
					priority: true,
					
					parentCategoryId: true,
					_count: {
						select: {
							products: true,
							childrenCategory: true
						}
					}
				},
				where: where,
				orderBy: column
					? order === 'asc'
						? {[column]: 'asc'}
						: {[column]: 'desc'}
					: {id: 'desc'},
			})
		])

		const pageCount = Math.ceil(total / per_page)
		return { data, pageCount }
	} catch (e) {
		return { data: [], pageCount: 0 }
	}
}

export async function getProductCategoriesParent(){
	try {
		const data = await prisma.productCategory.findMany({
			where: {
				parentCategory: {
					is: null
				}
			},
			orderBy: {
				priority: 'asc'
			}
		})

		return { data }
	} catch (e) {
		return { data: [] }
	}
}
