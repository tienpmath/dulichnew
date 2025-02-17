import React, {Fragment, useEffect, useState} from "react";
import {FormControl, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {TSettingSchema} from "@/actions/settings/validations";
import MultiImageUploadSettingLink from "@/components/multi-image-upload-setting-link";
import MultiImageUploadSetting from "@/components/multi-image-upload-setting";
import MultiTextInputSetting from "@/components/multi-text-input-setting";
import MultiTextInputSettingLink from "@/components/multi-text-input-setting-link";


type Props = {
	input: any[],
	handleChange: (e: any[]) => void
}
export default function SettingsFieldSetup(props: Props){
	function conditionRender(inputs: {
		index: number,
		setting: any
	}) {
		const {index, setting} = inputs
		
		if(setting.type === 'inputs-link'){
			return (
				<>
					<MultiTextInputSettingLink
						data={(props.input[index]?.data || [])?.map((item, i) => ({
							text: item,
							url: String((props.input[index]?.data_links || [])[i])
						}))}
						handleChange={(e) => {
							const values = [...props.input]
							values.splice(index, 1, {
								...props.input[index],
								data: e.map((d) => (d.text)),
								data_links: e.map((d) => (d.url))
							})
							props.handleChange(values)
						}}
						disabledAdd={setting.disabled_add}
						labels={setting.data_desc}
					/>
				</>
			)
		}
		
		return (
			<MultiTextInputSetting
				data={props.input[index]?.data || []}
				handleChange={(e) => {
					const values = [...props.input]
					values.splice(index, 1, {
						...props.input[index],
						data: e
					})
					props.handleChange(values)
				}}
				disabledAdd={setting.disabled_add}
				labels={setting.data_desc}
			/>
		)
	}
	
	return (
		<>
			<FormItem className={'border p-3 rounded-md'}>
				{(props.input as TSettingSchema[]).map((setting, itemIndex) => {
					return (
						<Fragment key={setting.name}>
							<div className={'font-bold'}>
								{setting.name}
							</div>
							{conditionRender({index: itemIndex, setting})}
						</Fragment>
					)
				})}
			</FormItem>
		</>
	)
}
