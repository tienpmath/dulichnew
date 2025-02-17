import {Prisma, PostCategory} from "@prisma/client";
import PostCategoryCreateInput = Prisma.PostCategoryCreateInput;
import PostCategoryUpdateInput = Prisma.PostCategoryUpdateInput;
import PostCategoryGetPayload = Prisma.PostCategoryGetPayload;
import {createCategorySchema, defaultCatValue} from "@/actions/common/category-schema";
import {z} from "@/locales/zod-custom";
import {SettingSchema} from "@/actions/settings/validations";

export type TPostCategoryCreateInput = PostCategoryCreateInput
export type TPostCategoryUpdateInput = PostCategoryUpdateInput
export type TPostCategory = PostCategory
export type TPostCategoryGetPayload = PostCategoryGetPayload<{
	include: {
		parentCategory: true,
		childrenCategory: true
	}
}>
export type TPostCategoryWithPostCount = PostCategoryGetPayload<{
	select: {
		id: true,
		slug: true,
		name: true,
		image: true,
		description: true,
		langEn: true,

		settings: true,
		
		parentCategoryId: true,
		_count: {
			select: {
				posts: true,
				childrenCategory: true
			}
		}
	}
}>

export const defaultPostCatValue: TCreatePostCategorySchema = {
	...defaultCatValue,
	settings: [
		{
			name: "Youtube Video ID",
			type: "inputs-link",
			data: [""],
			data_links: [""],
			data_desc: [""],
			disabled_add: true,
			length: 1,
		},
		{
			name: "Layout",
			type: "array",
			data: [""],
			data_links: [""],
			data_desc: ["Sử dụng layout cho trang"],
			disabled_add: true,
			length: 1,
		},
	],
}


// create schema
export const createPostCategorySchema = createCategorySchema.extend({
	settings: z.array(SettingSchema).or(z.array(z.any())),
})
export type TCreatePostCategorySchema = z.infer<typeof createPostCategorySchema>

// upload schema
export const UpdatePostCategorySchema = createPostCategorySchema.partial()
export type TUpdatePostCategorySchema = z.infer<typeof UpdatePostCategorySchema>
