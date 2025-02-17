import {z} from "@/locales/zod-custom"

import {Prisma, Setting} from "@prisma/client";
import SettingCreateInput = Prisma.SettingCreateInput;
import SettingUpdateInput = Prisma.SettingUpdateInput;
import SettingGetPayload = Prisma.SettingGetPayload;

export type TSettingCreateInput = SettingCreateInput
export type TSettingUpdateInput = SettingUpdateInput
export type TSetting = Setting


export const SettingSchema = z.object({
	name: z.string(),
	description: z.optional(z.string()),
	type: z.string(), // images, images-link, inputs-link, array
	data: z.array(z.string()),
	disabled_add: z.optional(z.boolean()),
	length: z.optional(z.number()),
	data_desc: z.optional(z.array(z.string())),
	data_links: z.optional(z.array(z.string())),
})
export type TSettingSchema = z.infer<typeof SettingSchema>

export const UpdateSettingSchema = z.object({
	name: z.string(),
	slug: z.string(),
	value: z.array(SettingSchema)
})
export type TUpdateSettingSchema = z.infer<typeof UpdateSettingSchema>
