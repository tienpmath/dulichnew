import {Prisma, ProductCategory} from "@prisma/client";
import ProductCategoryCreateInput = Prisma.ProductCategoryCreateInput;
import ProductCategoryUpdateInput = Prisma.ProductCategoryUpdateInput;
import ProductCategoryGetPayload = Prisma.ProductCategoryGetPayload;
import {z} from "@/locales/zod-custom";
import {createCategorySchema, defaultCatValue} from "@/actions/common/category-schema";
import {SettingSchema} from "@/actions/settings/validations";

export type TProductCategoryCreateInput = ProductCategoryCreateInput
export type TProductCategoryUpdateInput = ProductCategoryUpdateInput
export type TProductCategory = ProductCategory
export type TProductCategoryGetPayload = ProductCategoryGetPayload<{
	include: {
		parentCategory: true,
		childrenCategory: true
	}
}>
export type TProductCategoryWithProductCount = ProductCategoryGetPayload<{
	select: {
		id: true,
		slug: true,
		name: true,
		image: true,
		description: true,
		langEn: true,

		priority: true,
		hiddenAtSidebar: true,
		
		variants: true,
		settings: true,

		parentCategoryId: true,
		_count: {
			select: {
				products: true,
				childrenCategory: true
			}
		}
	}
}>


export const defaultProdCatValue: TCreateProductCategorySchema = {
	...defaultCatValue,
	variants: [],
	settings: [
		{
			name: "Youtube Video ID",
			type: "inputs-link",
			data: [""],
			data_links: [""],
			data_desc: [""],
			disabled_add: true,
			length: 1,
		}
	],
}

// create schema
export const createProductCategorySchema = createCategorySchema.extend({
	variants: z.array(z.any()),
	settings: z.array(SettingSchema).or(z.array(z.any())),
	hiddenAtSidebar: z.boolean().optional()
})
export type TCreateProductCategorySchema = z.infer<typeof createProductCategorySchema>

// upload schema
export const UpdateProductCategorySchema = createProductCategorySchema.partial()
export type TUpdateProductCategorySchema = z.infer<typeof UpdateProductCategorySchema>
