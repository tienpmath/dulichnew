"use client"

import React, {Fragment, useTransition} from "react";
import {Form} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {TSetting, TSettingSchema, TUpdateSettingSchema, UpdateSettingSchema} from "@/actions/settings/validations";
import {zodResolver} from "@hookform/resolvers/zod";
import MultiImageUploadSetting from "@/components/multi-image-upload-setting";
import MultiTextInputSetting from "@/components/multi-text-input-setting";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {updateSetting} from "@/actions/settings/actions";
import {toast} from "sonner";
import _ from "lodash";
import MultiImageUploadSettingLink from "@/components/multi-image-upload-setting-link";
import MultiTextInputSettingLink from "@/components/multi-text-input-setting-link";

export default function Setting(props:{
	data: TSetting
}){
	const data = props.data

	const form = useForm<TUpdateSettingSchema>({
		resolver: zodResolver(UpdateSettingSchema),
		// @ts-ignore
		defaultValues: {
			...data
		}
	})
	const [isPending, startTransition] = useTransition();

	const onSubmit = async (input: TUpdateSettingSchema) => {
		startTransition(async () => {
			const {error} = await updateSetting(input, data.id)

			if (error) {
				toast.error(error)
				return
			}

			toast.success("Đã cập nhật tùy chỉnh")
		})
	}
	
	function conditionRender(props: {
		index: number,
		setting: any
	}) {
		const {index, setting} = props
		
		if(setting.type === 'images-link'){
			return (
				<>
					<MultiImageUploadSettingLink
						data={(form.getValues('value')[index]?.data || [])?.map((item, i) => ({
							text: String((form.getValues('value')[index]?.data_links || [])[i]),
							imageUrl: item
						}))}
						handleChange={(e) => {
							const values = [...form.getValues('value')]
							values.splice(index, 1, {
								...form.getValues('value')[index],
								data: e.map((d) => (d.imageUrl)),
								data_links: e.map((d) => (d.text))
							})
							form.setValue('value', values)
						}}
						disabledAdd={setting.disabled_add}
						labels={setting.data_desc}
					/>
				</>
			)
		}
		if(setting.type === 'images'){
			return (
				<>
					<MultiImageUploadSetting
						images={form.getValues('value')[index]?.data || []}
						handleChange={(e) => {
							const values = [...form.getValues('value')]
							values.splice(index, 1, {
								...form.getValues('value')[index],
								data: e
							})
							form.setValue('value', values)
						}}
						disabledAdd={setting.disabled_add}
						labels={setting.data_desc}
					/>
				</>
			)
		}
		if(setting.type === 'inputs-link'){
			return (
				<>
					<MultiTextInputSettingLink
						data={(form.getValues('value')[index]?.data || [])?.map((item, i) => ({
							text: item,
							url: String((form.getValues('value')[index]?.data_links || [])[i])
						}))}
						handleChange={(e) => {
							const values = [...form.getValues('value')]
							values.splice(index, 1, {
								...form.getValues('value')[index],
								data: e.map((d) => (d.text)),
								data_links: e.map((d) => (d.url))
							})
							form.setValue('value', values)
						}}
						disabledAdd={setting.disabled_add}
						labels={setting.data_desc}
					/>
				</>
			)
		}
		
		return (
			<MultiTextInputSetting
				data={form.getValues('value')[index]?.data || []}
				handleChange={(e) => {
					const values = [...form.getValues('value')]
					values.splice(index, 1, {
						...form.getValues('value')[index],
						data: e
					})
					form.setValue('value', values)
				}}
				disabledAdd={setting.disabled_add}
				labels={setting.data_desc}
			/>
		)
	}

	return(
		<>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className={'space-y-5'}
				>
					<div className="flex justify-between items-center gap-5">
						<h2 className={'text-xl'}>{data.name}</h2>
						<div>
							<Button
								type={'submit'}
								disabled={isPending}
							>
								Cập nhật
							</Button>
						</div>
					</div>
					<div
						className={'grid lg:grid-cols-3 gap-5'}
					>
						{_.chunk(data.value, Math.ceil(data.value.length / 3)).map((row, rowIndex) => (
							<div key={'row_'+rowIndex} className={'space-y-5'}>
								{(row as TSettingSchema[]).map((setting, itemIndex) => {
									const index = (rowIndex*Math.ceil(data.value.length / 3))+(itemIndex)
									return (
										<div key={setting.name} className={''}>
											<Card>
												<CardHeader>
													<CardTitle>
														{setting.name}
													</CardTitle>
													<CardDescription>
														{setting.description}
													</CardDescription>
												</CardHeader>
												<CardContent>
													{conditionRender({index, setting})}
												</CardContent>
											</Card>
										</div>
									)
								})}
							</div>
						))}
					</div>
				</form>
			</Form>
		</>
	)
}
