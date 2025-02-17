"use server";

import prisma from "@/lib/prisma";
import {unstable_noStore as noStore} from "next/dist/server/web/spec-extension/unstable-no-store";
import {revalidatePath} from "next/cache";
import {getErrorMessage} from "@/lib/handle-error";
import {TProductCommentCreateInput, TProductCommentUpdateInput} from "@/actions/products/rate/validations";

export const addProductComment = async (
	values: TProductCommentCreateInput
) => {
	noStore()

	try {
		const res = await prisma.productComment.create({
			data: values
		})

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
export const updateProductComment = async (
	values: TProductCommentUpdateInput,
	id: string,
) => {
	noStore()

	try {
		const res = await prisma.productComment.update({
			where: {id},
			data: values
		})

		return {
			data: res,
			error: null,
		}
	} catch (e) {
		return {
			data: null,
			error: getErrorMessage(e),
		}
	}
}

export async function deleteProductComment(id: string) {
	try {
		const [, data] = await prisma.$transaction([
			prisma.productComment.update({
				where: {id},
				data: {
					product: undefined
				}
			}),
			prisma.productComment.delete({where: {id}})
		])

		return {
			data: data,
			error: null
		};
	} catch (e) {
		return {
			data: null,
			error: getErrorMessage(e),
		}
	}
}
export async function deleteProductComments(input: {ids: string[]}) {
	try {
		const [, data] = await prisma.$transaction(async (tx) => {
			for (const id of input.ids) {
				await tx.productComment.update({
					where: {id},
					data: {
						product: undefined
					}
				})
			}

			const data = await tx.productComment.deleteMany({
				where: {
					id: {
						in: input.ids
					}
				},
			})

			return [null, data]
		})

		return {
			data: data,
			error: null
		};
	} catch (e) {
		return {
			data: null,
			error: getErrorMessage(e),
		}
	}
}
