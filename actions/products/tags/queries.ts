"use server";

import prisma from "@/lib/prisma";
import {TProductTag} from "@/actions/products/tags/validations";
import {Prisma} from ".prisma/client";
import ProductTagWhereInput = Prisma.ProductTagWhereInput;
import { filterColumn } from "@/lib/filter-column";
import _ from "lodash";
import {getErrorMessage} from "@/lib/handle-error";
import {TGetTagsSchema} from "@/actions/common/tag-schema";

export async function getProductTag(id: string) {
	try {
		const res = await prisma.productTag.findUnique({where: {id}});
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
export async function getProductTagBySlug(slug: string): Promise<{data: TProductTag | null, error: string | null}> {
	try {
		const res = await prisma.productTag.findUnique({
			where: {
				slug: slug
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
export async function getProductTags(
	input: TGetTagsSchema
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
	]) as [keyof TProductTag | undefined, "asc" | "desc" | undefined]

	// where
	const expressions: ProductTagWhereInput[] = [
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
			prisma.productTag.count({
				where: where,
			}),
			prisma.productTag.findMany({
				take: per_page,
				skip: (page - 1) * per_page,
				select: {
					id: true,
					slug: true,
					name: true,
					langEn: true,
					_count: {
						select: {
							products: true
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
