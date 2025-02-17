"use client"

import * as React from "react"
import {Fragment, useEffect, useState} from "react"
import {zodResolver} from "@hookform/resolvers/zod"
import {ReloadIcon} from "@radix-ui/react-icons"
import {useForm} from "react-hook-form"
import {toast} from "sonner"

import {Button} from "@/components/ui/button"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle,} from "@/components/ui/sheet"
import {Textarea} from "@/components/ui/textarea"

import {
	createPostCategorySchema,
	defaultPostCatValue,
	TCreatePostCategorySchema,
	TPostCategoryWithPostCount
} from "@/actions/posts/categories/validations";
import {addPostCategory, updatePostCategory} from "@/actions/posts/categories/actions";
import {Input} from "@/components/ui/input";
import slug from "slug";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {getImageData, uploadFile} from "@/lib/image-data";
import {ACCEPTED_IMAGE_TYPES} from "@/enum/enums";
import {ScrollArea} from "@/components/ui/scroll-area";
import {SwitchLangInput} from "@/app/(protected)/dashboard/(dashboard)/_components/SwitchLangInput";
import {cn} from "@/lib/utils";
import SettingsFieldSetup from "@/components/dashboard/settings-field-setup";
import _ from "lodash";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {
	useCategoriesTable
} from "@/app/(protected)/dashboard/posts/categories/_components/post-categories-table-provider";

interface AddCategorySheetProps
	extends React.ComponentPropsWithRef<typeof Sheet> {
	data?: TPostCategoryWithPostCount | null
}

export function AddPostCategorySheet({ data, ...props }: AddCategorySheetProps) {
	const [isUpdatePending, startUpdateTransition] = React.useTransition()
	const [previewVi, setPreviewVi] = useState("");
	const [previewEn, setPreviewEn] = useState("");
	const [langState, setLangState] = useState('vi')
	
	const {categories} = useCategoriesTable()
	
	const formVi = useForm<TCreatePostCategorySchema>({
		resolver: zodResolver(createPostCategorySchema),
		defaultValues: {...defaultPostCatValue}
	})

	const formEn = useForm<TCreatePostCategorySchema>({
		resolver: zodResolver(createPostCategorySchema),
		defaultValues: {...defaultPostCatValue}
	})

	function onSubmit(input: TCreatePostCategorySchema) {
		startUpdateTransition(async () => {
			let imageUrl = ''
			if(input.image && typeof input.image === 'object'){
				const resImage = await uploadFile(input.image[0])
				const data = await resImage?.json();
				imageUrl = data.secure_url
			}

			if(data?.id){
				let error: any = null

				if(langState === 'en'){
					const res = await updatePostCategory({
						langEn: {
							...input,
							image: imageUrl || input.image,
						}
					}, data.id)
					error = res.error
				} else {
					const res = await updatePostCategory({
						...input,
						image: imageUrl || input.image,
					}, data.id)
					error = res.error
				}

				if (error) {
					toast.error(error)
					return
				}

				props.onOpenChange?.(false)
				toast.success("Đã cập nhật Category")
			} else {
				if(langState !== 'en'){
					const { error } = await addPostCategory({
						...input,
						image: imageUrl
					})

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

		formVi.setValue('name', data?.name || "")
		formVi.setValue('slug', data?.slug || "")
		formVi.setValue('image', data?.image || "")
		formVi.setValue('description', data?.description || "")
		formVi.setValue('settings', (data?.settings && data?.settings.length > 0) ? data?.settings : defaultPostCatValue.settings || [])
		formVi.setValue('parentCategoryId', data?.parentCategoryId || undefined)
		setPreviewVi(data?.image || "")


		const langEnData = createPostCategorySchema.safeParse(data?.langEn)
		if(langEnData.success){
			formEn.setValue('name', langEnData.data.name || "")
			formEn.setValue('slug', langEnData.data.slug || "")
			formEn.setValue('image', langEnData.data.image || "")
			formEn.setValue('description', langEnData.data.description || "")
		}
	}, [props.open])

	return (
		<Sheet {...props}>
			<SheetContent className="flex flex-col gap-6 sm:max-w-md p-2">
				<SheetHeader className="text-left p-4">
					<SheetTitle>{data ? 'Cập nhật Category' : 'Tạo thêm Category'}</SheetTitle>
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
										name="image"
										render={({ field: {onChange, value, ...rest} }) => (
											<FormItem className={''}>
												<FormLabel className={'flex-shrink-0 md:w-40 md:mt-4'}>
													Ảnh
												</FormLabel>
												<div className={'space-y-2 flex-grow'}>
													<Avatar className="w-24 h-24 rounded-none">
														<AvatarImage src={(ln === 'vi' ? previewVi : previewEn) || ""} />
														<AvatarFallback>Avatar</AvatarFallback>
													</Avatar>
													
													<FormControl>
														<Input
															type="file"
															{...rest}
															onChange={(event) => {
																const { files, displayUrl} = getImageData(event)
																ln === 'vi' ? setPreviewVi(displayUrl) : setPreviewEn(displayUrl)
																onChange(files);
															}}
															accept={ACCEPTED_IMAGE_TYPES.join(',')}
														/>
													</FormControl>
													<FormDescription>
														Vui lòng chọn ảnh
													</FormDescription>
													<FormMessage />
												</div>
											</FormItem>
										)}
									/>
									
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
									
									
									{Boolean(_.isNil(data) || data?._count.childrenCategory === 0) && Boolean(ln !== 'en') && (
										<FormField
											control={form.control}
											name={'parentCategoryId'}
											render={({field}) => (
												<FormItem>
													<FormLabel>Danh mục cha</FormLabel>
													<Select
														value={field.value}
														onValueChange={field.onChange}
													>
														<FormControl>
															<SelectTrigger className="">
																<SelectValue placeholder="Danh mục cha"/>
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{categories.map(c => (
																<Fragment key={c.slug}>
																	<SelectItem key={c.slug} value={c.id}>{c.name}</SelectItem>
																</Fragment>
															))}
														</SelectContent>
														<FormMessage/>
													</Select>
												</FormItem>
											)}
										/>
									)}

									<FormField
										control={form.control}
										name="description"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Mô tả
												</FormLabel>
												<div className={'space-y-2 flex-grow'}>
													<FormControl>
														<Textarea
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</div>
											</FormItem>
										)}
									/>
									
									{Boolean(ln !== 'en') && (
										<SettingsFieldSetup
											input={form.getValues('settings')}
											handleChange={(e) => form.setValue('settings', e)}
										/>
									)}
									
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
											{data ? 'Lưu' : 'Tạo'}
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
