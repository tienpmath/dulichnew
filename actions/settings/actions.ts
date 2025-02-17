"use server";

import prisma from "@/lib/prisma";
import {unstable_noStore as noStore} from "next/dist/server/web/spec-extension/unstable-no-store";
import {revalidatePath} from "next/cache";
import {getErrorMessage} from "@/lib/handle-error";
import {TSettingCreateInput, TSettingUpdateInput} from "@/actions/settings/validations";

export const addSetting = async (
	values: TSettingCreateInput
) => {
	noStore()

	try {
		const res = await prisma.setting.create({
			data: values
		})
		revalidatePath("/dashboard/theme")

		return {
			data: res,
			error: null
		}
	} catch (e) {
		if (JSON.stringify(e).includes('slug_key')) {
			return {
				error: `Slug "${values.slug}" đã được sử dụng, hãy đổi slug khác`,
				cause: 'slug',
				data: null
			}
		}
		return {
			data: null,
			error: getErrorMessage(e),
		}
	}
}
export const updateSetting = async (
	values: TSettingUpdateInput,
	id: string,
) => {
	noStore()

	try {
		const res = await prisma.setting.update({
			where: {id},
			data: values
		})
		revalidatePath("/dashboard/theme")

		return {
			data: res,
			error: null,
		}
	} catch (e) {
		if (JSON.stringify(e).includes('slug_key')) {
			return {
				error: `Slug "${values.slug}" đã được sử dụng, hãy đổi slug khác`,
				cause: 'slug',
				data: null
			}
		}
		return {
			data: null,
			error: getErrorMessage(e),
		}
	}
}

