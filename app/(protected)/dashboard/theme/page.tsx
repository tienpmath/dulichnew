import {Metadata} from "next";
import PageHeading from "@/components/dashboard/page-heading";
import React from "react";
import {getSettingBySlug, getSettings} from "@/actions/settings/queries";
import ThemePage from "@/app/(protected)/dashboard/theme/_components/theme-page";

export const metadata: Metadata = {
	title: 'Tùy chỉnh',
}

export default function Page(){
	const settingsPromise = getSettings()
	return (
		<>
			<PageHeading
				title={'Tùy chỉnh'}
			/>
			<div className="container space-y-5">
				<React.Suspense fallback={'Loading'}>
					<ThemePage settingsPromise={settingsPromise}/>
				</React.Suspense>
			</div>
		</>
	)
}
