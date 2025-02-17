"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { ReloadIcon } from "@radix-ui/react-icons"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet"

import {
	TProductTagWithProductCount
} from "@/actions/products/tags/validations";
import {addProductTag, updateProductTag} from "@/actions/products/tags/actions";
import {Input} from "@/components/ui/input";
import slug from "slug";
import {useEffect, useState} from "react";
import {createTagSchema, defaultTagValue, TCreateTagSchema} from "@/actions/common/tag-schema";
import {ScrollArea} from "@/components/ui/scroll-area";
import {cn} from "@/lib/utils";
import {SwitchLangInput} from "@/app/(protected)/dashboard/(dashboard)/_components/SwitchLangInput";

interface AddTagSheetProps
	extends React.ComponentPropsWithRef<typeof Sheet> {
	tag?: TProductTagWithProductCount
}

export function AddProductTagSheet({ tag, ...props }: AddTagSheetProps) {
	const [isUpdatePending, startUpdateTransition] = React.useTransition()
	const [previewVi, setPreviewVi] = useState("");
	const [previewEn, setPreviewEn] = useState("");
	const [langState, setLangState] = useState('vi')

	const formVi = useForm<TCreateTagSchema>({
		resolver: zodResolver(createTagSchema),
		defaultValues: defaultTagValue
	})

	const formEn = useForm<TCreateTagSchema>({
		resolver: zodResolver(createTagSchema),
		defaultValues: defaultTagValue
	})

	function onSubmit(input: TCreateTagSchema) {
		startUpdateTransition(async () => {
			if(tag?.id){
				let error: any = null

				if(langState === 'en') {
					const res = await updateProductTag({
						langEn: input
					}, tag.id)
					error = res.error
				} else {
					const res = await updateProductTag({
						...input,
					}, tag.id)
					error = res.error
				}

				if (error) {
					toast.error(error)
					return
				}

				props.onOpenChange?.(false)
				toast.success("Đã cập nhật Tag")
			} else {
				if(langState !== 'en') {
					const { error } = await addProductTag(input)

					if (error) {
						toast.error(error)
						return
					}

					props.onOpenChange?.(false)
					toast.success("Tạo thành công")
				} else {
					toast.error("Vui lòng tạo với tiếng việt trước")
				}
			}
		})
	}

	useEffect(() => {
		formVi.reset()
		formEn.reset()
		setLangState('vi')

		formVi.setValue('name', tag?.name || "")
		formVi.setValue('slug', tag?.slug || "")

		const langEnData = createTagSchema.safeParse(tag?.langEn)
		if(langEnData.success){
			formEn.setValue('name', langEnData.data.name || "")
			formEn.setValue('slug', langEnData.data.slug || "")
		}
	}, [props.open])

	return (
		<Sheet {...props}>
			<SheetContent className="flex flex-col gap-6 sm:max-w-md p-2">
				<SheetHeader className="text-left p-4">
					<SheetTitle>{tag ? 'Cập nhật Tag' : 'Tạo thêm Tag'}</SheetTitle>
				</SheetHeader>
				<ScrollArea className={'p-4'}>
					<SwitchLangInput onClick={() => langState === 'en' ? setLangState('vi') : setLangState('en')} />

					{['vi', 'en'].map((ln, index) => {
						const form = ln === 'vi' ? formVi : formEn

						return (
							<Form {...form} key={index}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className={cn("flex flex-col gap-4", {
										"hidden": langState !== ln
									})}
								>
									<FormField
										control={form.control}
										name="name"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Tên
												</FormLabel>
												<div className={'space-y-2 flex-grow'}>
													<FormControl>
														<Input
															{...field}
															required
														/>
													</FormControl>
													<FormMessage />
												</div>
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="slug"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Slug
												</FormLabel>
												<div className={'space-y-2 flex-grow'}>
													<div className="flex items-center space-x-2">
														<FormControl>
															<Input
																{...field}
																required
															/>
														</FormControl>
														<Button
															type={'button'}
															variant={'secondary'}
															onClick={() => {
																const sl = slug(form.getValues('name') || "")
																form.setValue('slug', sl)
															}}
														>
															Generate
														</Button>
													</div>
													<FormMessage />
												</div>
											</FormItem>
										)}
									/>
									<SheetFooter className="gap-2 pt-2 sm:space-x-0">
										<SheetClose asChild>
											<Button type="button" variant="outline">
												Hủy
											</Button>
										</SheetClose>
										<Button disabled={isUpdatePending}>
											{isUpdatePending && (
												<ReloadIcon
													className="mr-2 size-4 animate-spin"
													aria-hidden="true"
												/>
											)}
											Lưu
										</Button>
									</SheetFooter>
								</form>
							</Form>
						)
					})}
				</ScrollArea>
			</SheetContent>
		</Sheet>
	)
}
