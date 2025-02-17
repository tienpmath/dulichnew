"use server";

import prisma from "@/lib/prisma";
import {getErrorMessage} from "@/lib/handle-error";

export async function getSetting(id: string) {
	try {
		const res = await prisma.setting.findUnique({where: {id}});
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
export async function getSettings() {
	try {
		const res = await prisma.setting.findMany();
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
export async function getSettingBySlug(slug: string) {
	try {
		const res = await prisma.setting.findUnique({
			where: {
				slug: slug
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
