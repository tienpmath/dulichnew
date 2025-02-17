import {Prisma, ProductComment} from "@prisma/client";
import ProductCommentCreateInput = Prisma.ProductCommentCreateInput;
import ProductCommentUncheckedCreateInput = Prisma.ProductCommentUncheckedCreateInput;
import ProductCommentUpdateInput = Prisma.ProductCommentUpdateInput;
import ProductCommentGetPayload = Prisma.ProductCommentGetPayload;
import {z} from "@/locales/zod-custom";

export type TProductCommentCreateInput = ProductCommentUncheckedCreateInput
export type TProductCommentUpdateInput = ProductCommentUpdateInput
export type TProductComment = ProductComment

export const defaultProductComment: TCreateProductCommentSchema = {
	comment: "",
	rate: 5,
	type: 'rating',
	productId: "",
	email: "",
	name: "",
}
export const createProductCommentSchema = z.object({
	comment: z.string().max(250).min(10),
	rate: z.coerce.number(),
	type: z.string().default('rating'),
	productId: z.string(),
	email: z.string().email(),
	name: z.string().max(100).min(3),
})
export type TCreateProductCommentSchema = z.infer<typeof createProductCommentSchema>
export const UpdateProductCommentSchema = createProductCommentSchema.partial()
export type TUpdateProductCommentSchema = z.infer<typeof UpdateProductCommentSchema>
