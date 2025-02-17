import {getSettingBySlug} from "@/actions/settings/queries";
import * as React from "react";
import Gallery from "@/components/public/section/gallery";
import {getTranslations} from "next-intl/server";
import { redirect } from 'next/navigation'

export default async function Page(){
	const {data: setting} = await getSettingBySlug('home-page')
	const t = await getTranslations();

	return (
		<>
			<div className="min-h-[50vh] container grid grid-cols-1 justify-start gap-8">
				<h1 className="text-3xl font-semibold capitalize">Photos</h1>

				<Gallery data={setting}/>
			</div>
		</>
	)
}

// export default function Page(){
// 	redirect('https://kenh14.vn')
// }
