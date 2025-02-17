"use server";

import prisma from "@/lib/prisma";
import {getErrorMessage} from "@/lib/handle-error";
import {TGetPostsSchema, TPost, TPostWithRelation} from "@/actions/posts/validations";
import {filterColumn} from "@/lib/filter-column";
import _ from "lodash";
import {PostStatus, Prisma, ProductStatus} from ".prisma/client";
import PostWhereInput = Prisma.PostWhereInput;

export async function findPost(id: string) {
	try {
		const res = await prisma.post.findUnique({where: {id}});
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
export async function getPublishedPostBySlug(slug: string): Promise<{data: TPostWithRelation | null, error: string | null}> {
	try {
		const res = await prisma.post.findUnique({
			where: {
				slug: slug,
				status: PostStatus.PUBLISHED
			},
			include: {
				categories: true,
				tags: true,
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
export async function getPostSiteMap() {
	try {
		const res = await prisma.post.findMany({
			where:{
				status: PostStatus.PUBLISHED
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
export async function getRandomPublishedPosts(limit: number) {
	try {
		const postsCount = await prisma.post.count({where: {
			status: PostStatus.PUBLISHED,
			NOT: {
				image: ""
			}
		}});
		const skip = Math.max(Math.floor(Math.random() * (postsCount - limit)), 0);

		const res = await prisma.post.findMany({
			where: {
				status: PostStatus.PUBLISHED,
				NOT: {
					image: ""
				}
			},
			include: {
				categories: true,
				tags: true,
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
export async function getPosts(
	input: TGetPostsSchema
): Promise<{data: TPostWithRelation[], pageCount: number}> {
	const {
		title,
		slug,
		authorId,
		status,
		image,

		enabledRelated,

		tags,
		tag_slug,
		categories,
		category_slug,
		settings,

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
	]) as [keyof TPost | undefined, "asc" | "desc" | undefined]

	// date
	let fromDay = from ? new Date(from) : undefined
	let toDay = to ? new Date(to) : undefined
	if(fromDay && toDay) {
		fromDay.setHours(0,0,0,0);
		toDay.setHours(23, 59, 59, 999)
	}
	
	// settings
	let tempSettings: {slug: string, value: string}[] = []
	if(settings) {
		const data = JSON.parse(decodeURIComponent(settings || ""))
		Object.entries(data).forEach(([key, value], index) => {
			(value as string[]).forEach(v => {
				tempSettings.push({slug: key, value: v})
			})
		})
	}
	
	// where
	const expressions: PostWhereInput[] = [
		image
			? filterColumn({
				column: 'image',
				value: image,
			})
			: {},
		settings
			? {
				settings: {
					hasSome: tempSettings
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
		typeof enabledRelated === "boolean"
			? {
				enabledRelated
			}
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
				const posts =  await tx.post.findRaw({
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
				const postIds = posts.map(post => post._id["$oid"]);
				const total = await tx.post.count({
					where: {
						id: { in: postIds }
					},
				})
				const data = await tx.post.findMany({
					take: per_page,
					skip: (page - 1) * per_page,
					where: {
						id: { in: postIds }
					},
					orderBy: column
						? order === 'asc'
							? {[column]: 'asc'}
							: {[column]: 'desc'}
						: {id: 'desc'},
					include: {
						categories: true,
						tags: true,
					},
				})

				return [total, data]
			}

			const total = await prisma.post.count({
				where: where,
			})
			const data = await prisma.post.findMany({
				take: per_page,
				skip: (page - 1) * per_page,
				where: where,
				orderBy: column
					? order === 'asc'
						? {[column]: 'asc'}
						: {[column]: 'desc'}
					: {id: 'desc'},
				include: {
					categories: true,
					tags: true,
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

export type TShortPostConstant = {
	id: string,
	name: string,
	slug: string,
}
export async function getPostConstants() {
	const res = await prisma.$transaction([
		prisma.postCategory.findMany({
			select: {
				id: true,
				name: true,
				slug: true,
				langEn: true,
				settings: true,
				childrenCategory: true,
			},
			where: {
				parentCategory: {
					is: null
				}
			}
		}),
		prisma.postTag.findMany({
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
