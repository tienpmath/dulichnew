import {PostStatus, Prisma} from "@prisma/client";
import {z} from "@/locales/zod-custom"
import {Post} from ".prisma/client";
import slug from "slug";
import {ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE} from "@/enum/enums";
import {isMongoId} from "validator";
import {RelatedLinkSchema} from "@/actions/common/ralated-link-schema";
import PostCreateInput = Prisma.PostCreateInput;
import PostUpdateInput = Prisma.PostUpdateInput;
import PostGetPayload = Prisma.PostGetPayload;

export type TPostCreateInput = PostCreateInput
export type TPostUpdateInput = PostUpdateInput
export type TPost = Post
export type TPostWithRelation = PostGetPayload<{
	include: {
		categories: true,
		tags: true
	}
}>

export const searchParamsSchema = z.object({
	authorId: z.string().optional(),
	tags: z.string().optional(),
	tag_slug: z.string().optional(),
	categories: z.string().optional(),
	category_slug: z.string().optional(),

	title: z.string().optional(),
	slug: z.string().optional(),
	status: z.string().optional(),
	image: z.string().optional(),

	enabledRelated: z.boolean().optional(),
	settings: z.string().optional(),

	page: z.coerce.number().default(1),
	per_page: z.coerce.number().default(10),
	sort: z.string().optional(),
	from: z.string().optional(),
	to: z.string().optional(),
	operator: z.enum(["and", "or"]).optional(),
	langEn: z.boolean().optional()
})

export const getPostsSchema = searchParamsSchema
export type TGetPostsSchema = z.infer<typeof getPostsSchema>
export const defaultValuePost: TAddPostSchema = {
	title: '',
	slug: '',
	keywords: '',

	description: '',
	metaDescription: '',
	body: '',

	status: PostStatus.DRAFT,
	image: '',

	viewCount: 0,
	relatedLinks: [],

	enabledRelated: true,

	settings: [
		{
			name: "Youtube Video ID",
			type: "inputs-link",
			data: [""],
			data_links: [""],
			data_desc: ["Ảnh đại diện bằng Video Youtube"],
			disabled_add: true,
			length: 1,
		}
	],
	categoryIDs: [],
	tagIDs: [],
	authorId: ''
}

// CREATE SCHEMA
export const AddPostSchema = z.object({
	title: z.string().max(300),
	slug: z.string().max(300).transform((v) => slug(v)),
	keywords: z.string().max(300),

	description: z.string(),
	metaDescription: z.string().max(400),
	body: z.string(),

	status: z.nativeEnum(PostStatus),
	image: z.any()
		.refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
		.refine(
			(files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
			"Only .jpg, .jpeg, .png and .webp formats are supported."
		).or(z.string().nullable()),

	viewCount: z.optional(z.coerce.number()),
	relatedLinks: z.array(RelatedLinkSchema).transform(
		(as) => as.filter((a) => a.name.length > 0 && a.url.length > 0)
	),

	enabledRelated: z.optional(z.coerce.boolean()),
	langEn: z.any().optional(),
	
	settings: z.array(z.any()),
	categoryIDs: z.array(z.string().trim().refine(isMongoId)).default([]),
	tagIDs: z.array(z.string().trim().refine(isMongoId)).default([]),
	authorId: z.string().default(""),

	// id: z.optional(z.string()),
	updatedAt: z.optional(z.date()),
	createdAt: z.optional(z.date()),
})
export type TAddPostSchema = z.infer<typeof AddPostSchema>

// UPDATE SCHEMA
export const UpdatePostSchema = AddPostSchema.partial().required({
	status: true
})
export type TUpdatePostSchema = z.infer<typeof UpdatePostSchema>
