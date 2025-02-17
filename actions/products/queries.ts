"use server";

import prisma from "@/lib/prisma";
import {getErrorMessage} from "@/lib/handle-error";
import {TGetProductsSchema, TProduct, TProductWithRelation} from "@/actions/products/validations";
import {filterColumn} from "@/lib/filter-column";
import _ from "lodash";
import {ProductStatus, Prisma} from ".prisma/client";
import ProductWhereInput = Prisma.ProductWhereInput;

export async function findProduct(id: string) {
	try {
		const res = await prisma.product.findUnique({
			where: {id},
			include: {
				categories: {
					include: {
						parentCategory: true
					}
				},
				tags: true,
				comments: true,
			},
		});
		return {
			data: res,
			error: null
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
export async function getPublishedProductBySlug(slug: string): Promise<{data: TProductWithRelation | null, error: string | null}> {
	try {
		const res = await prisma.product.findUnique({
			where: {
				slug: slug,
				status: ProductStatus.PUBLISHED
			},
			include: {
				categories: {
					include: {
						parentCategory: true
					}
				},
				tags: true,
				comments: true,
			},
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

export async function getProductSiteMap() {
	try {
		const res = await prisma.product.findMany({
			where:{
				status: ProductStatus.PUBLISHED
			},
			select: {
				title: true,
				slug: true,
				updatedAt: true,
			}
		});
		return {
			data: res,
			error: null
		}
	} catch (e) {
		return {
			data: null,
			error: getErrorMessage(e),
		}
	}
}

export async function getRandomPublishedProducts(limit: number): Promise<{data: TProductWithRelation[] | null, error: string | null}> {
	try {
		const productsCount = await prisma.product.count({where: {
			status: ProductStatus.PUBLISHED,
			NOT: {
				images: {
					equals: []
				}
			}
		}});
		const skip = Math.max(Math.floor(Math.random() * (productsCount-limit)), 0);

		const res = await prisma.product.findMany({
			where: {
				status: ProductStatus.PUBLISHED,
				NOT: {
					images: {
						equals: []
					}
				}
			},
			include: {
				categories: {
					include: {
						parentCategory: true
					}
				},
				tags: true,
				comments: true,
			},
			take: limit,
			skip,
			orderBy: {
				updatedAt: 'desc'
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

export async function getProducts(
	input: TGetProductsSchema
): Promise<{data: TProductWithRelation[], pageCount: number}> {
	const {
		title,
		slug,
		authorId,
		status,
		images,

		tags,
		tag_slug,
		categories,
		category_slug,
		variants,

		page,
		per_page,
		sort,
		operator,
		from,
		to,
		langEn,
	} = input

	// sort
	const [column, order] = (sort?.split(".").filter(Boolean) ?? [
		"createdAt",
		"desc",
	]) as [keyof TProduct | undefined, "asc" | "desc" | undefined]

	// date
	let fromDay = from ? new Date(from) : undefined
	let toDay = to ? new Date(to) : undefined
	if(fromDay && toDay) {
		fromDay.setHours(0,0,0,0);
		toDay.setHours(23, 59, 59, 999)
	}

	// variants
	let tempVariants: {slug: string, value: string}[] = []
	if(variants){
		const data = JSON.parse(decodeURIComponent(variants || ""))
		Object.entries(data).forEach(([key, value], index) => {
			(value as string[]).forEach(v => {
				tempVariants.push({slug: key, value: v})
			})
		})
	}

	// where
	const expressions: ProductWhereInput[] = [
		images
			? {
				NOT: {
					images: {
						equals: images
					}
				}
			} : {},
		variants
			? {
				variants: {
					hasSome: tempVariants
				}
			} : {},
		title
			? filterColumn({
				column: 'title',
				value: title,
			})
			: {},
		slug
			? filterColumn({
				column: 'slug',
				value: slug,
			})
			: {},
		status
			? filterColumn({
				column: 'status',
				value: status,
				isSelectable: true
			})
			: {},
		fromDay && toDay
			? {
				createdAt: {
					gte: fromDay,
					lte: toDay
				}
			}
			: {},
		tags
			? filterColumn({
				column: 'tags',
				value: tags,
				relation: {
					filterKey: 'id'
				}
			})
			: {},
		categories
			? filterColumn({
				column: 'categories',
				value: categories,
				relation: {
					filterKey: 'id'
				}
			})
			: {},
		tag_slug
			? filterColumn({
				column: 'tags',
				value: tag_slug,
				relation: {
					filterKey: 'slug'
				}
			})
			: {},
		category_slug
			? filterColumn({
				column: 'categories',
				value: category_slug,
				relation: {
					filterKey: 'slug'
				}
			})
			: {},
	].filter((i) => !_.isEmpty(i))
	const where =
		!operator || operator === "and" ? {AND: expressions} : {OR: expressions}

	try {
		const [total, data] = await prisma.$transaction(async (tx) => {
			if(langEn && title) {
				const products =  await tx.product.findRaw({
					filter: {
						"langEn.title": { $regex: String(title), $options: "i" }
					},
					options: {
						projection: {
							title: 1,
							slug: 1,
							"langEn.title": 1,
							_id: 1
						}
					}
				})
				// @ts-ignore
				const productIds = products.map(product => product._id["$oid"]);
				const total = await tx.product.count({
					where: {
						id: { in: productIds }
					},
				})
				const data = await tx.product.findMany({
					take: per_page,
					skip: (page - 1) * per_page,
					where: {
						id: { in: productIds }
					},
					orderBy: column
						? order === 'asc'
							? {[column]: 'asc'}
							: {[column]: 'desc'}
						: {id: 'desc'},
					include: {
						categories: {
							include: {
								parentCategory: true
							}
						},
						tags: true,
						comments: true,
					},
				})

				return [total, data]
			}

			const total = await tx.product.count({
				where: where,
			})
			const data = await tx.product.findMany({
				take: per_page,
				skip: (page - 1) * per_page,
				where: where,
				orderBy: column
					? order === 'asc'
						? {[column]: 'asc'}
						: {[column]: 'desc'}
					: {id: 'desc'},
				include: {
					categories: {
						include: {
							parentCategory: true
						}
					},
					tags: true,
					comments: true,
				},
			})
			return [total, data]
		})

		const pageCount = Math.ceil(total / per_page)
		return { data, pageCount }
	} catch (e) {
		return { data: [], pageCount: 0 }
	}
}

export type TShortProductConstant = {
	id: string,
	name: string,
	slug: string,
}
export async function getProductConstants() {
	const res = await prisma.$transaction([
		prisma.productCategory.findMany({
			select: {
				id: true,
				name: true,
				slug: true,
				variants: true,
				langEn: true,
				childrenCategory: true,
			},
			where: {
				parentCategory: {
					is: null
				}
			}
		}),
		prisma.productTag.findMany({
			select: {
				id: true,
				name: true,
				slug: true,
				langEn: true,
			}
		})
	]);
	return {
		categories: res[0],
		tags: res[1]
	}
}
