import {Prisma, ProductStatus} from "@prisma/client";
import {z} from "@/locales/zod-custom"
import {Product} from ".prisma/client";
import slug from "slug";
import {ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE} from "@/enum/enums";
import {isMongoId, isURL} from "validator";
import ProductCreateInput = Prisma.ProductCreateInput;
import ProductUpdateInput = Prisma.ProductUpdateInput;
import ProductGetPayload = Prisma.ProductGetPayload;

export type TProductCreateInput = ProductCreateInput
export type TProductUpdateInput = ProductUpdateInput
export type TProduct = Product
export type TProductWithRelation = ProductGetPayload<{
	include: {
		categories: {
			include: {
				parentCategory: true
			}
		},
		tags: true,
		comments: true,
	}
}>

export const searchParamsSchema = z.object({
	authorId: z.string().optional(),
	tags: z.string().optional(),
	tag_slug: z.string().optional(),
	categories: z.string().optional(),
	category_slug: z.string().optional(),
	variants: z.string().optional(),

	title: z.string().optional(),
	slug: z.string().optional(),
	status: z.string().optional(),
	images: z.array(z.string()).optional(),

	page: z.coerce.number().default(1),
	per_page: z.coerce.number().default(10),
	sort: z.string().optional(),
	from: z.string().optional(),
	to: z.string().optional(),
	operator: z.enum(["and", "or"]).optional(),
	langEn: z.boolean().optional()
})

export const getProductsSchema = searchParamsSchema
export type TGetProductsSchema = z.infer<typeof getProductsSchema>
export const defaultValueProduct: TAddProductSchema = {
	title: '',
	slug: '',
	keywords: '',

	description: '',
	metaDescription: '',
	body: '',
	extraBody: '',
	extraBody1: '',
	extraBody2: '',

	status: ProductStatus.DRAFT,
	image: '',
	images: [],

	variants: [],
	categoryIDs: [],
	tagIDs: [],
	authorId: ''
}


const ImageSchema = z.object({url: z.string(), index: z.number()})
export type TImage = z.infer<typeof ImageSchema>
export const createImageUrlFromJson = (content: string): TImage => {
	return z
		.string()
		.transform((_, ctx) => {
			try {
				return JSON.parse(content);
			} catch (error) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'invalid json',
				});
				return z.never;
			}
		})
		.pipe(ImageSchema)
		.parse(content);
};
export const parseProductImages = (content: Prisma.JsonValue[]): TImage[] => {
	return content.map(img => createImageUrlFromJson(JSON.stringify(img)))
};

// CREATE SCHEMA
export const AddProductSchema = z.object({
	title: z.string().max(300),
	slug: z.string().max(300).transform((v) => slug(v)),
	keywords: z.string().max(300),

	description: z.string(),
	metaDescription: z.string().max(400),
	body: z.string(),
	extraBody: z.string(),
	extraBody1: z.string().nullable(),
	extraBody2: z.string().nullable(),

	price: z.optional(z.coerce.number()),
	fakePrice: z.optional(z.coerce.number()),

	status: z.nativeEnum(ProductStatus),
	image: z.any()
		.refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
		.refine(
			(files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
			"Only .jpg, .jpeg, .png and .webp formats are supported."
		).or(z.string().nullable()),
	images: z.array(ImageSchema).transform(
		(as) => as.filter((a) => isURL(a.url))
	),

	variants: z.array(z.any()),
	categoryIDs: z.array(z.string().trim().refine(isMongoId)).default([]),
	tagIDs: z.array(z.string().trim().refine(isMongoId)).default([]),
	authorId: z.string().default(""),

	langEn: z.any().optional(),

	// id: z.optional(z.string()),
	updatedAt: z.optional(z.date()),
	createdAt: z.optional(z.date()),
})
export type TAddProductSchema = z.infer<typeof AddProductSchema>

// UPDATE SCHEMA
export const UpdateProductSchema = AddProductSchema.partial()
export type TUpdateProductSchema = z.infer<typeof UpdateProductSchema>
