import {getSettings} from "@/actions/settings/queries";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Setting from "@/app/(protected)/dashboard/theme/_components/setting";

export default function ThemePage(props:{
	settingsPromise: ReturnType<typeof getSettings>
}){
	const {data: settings} = React.use(props.settingsPromise)

	if(!settings) return <></>

	return (
		<>
			<Tabs defaultValue="setting_0" >
				<TabsList className={'mb-3'}>
					{settings.map((setting, index) => (
						<TabsTrigger value={`setting_${index}`} key={index}>{setting.name}</TabsTrigger>
					))}
				</TabsList>
				{settings.map((setting, index) => (
					<TabsContent value={`setting_${index}`} key={index}>
						<Setting data={setting}/>
					</TabsContent>
				))}
			</Tabs>
		</>
	)
}
