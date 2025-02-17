'use client'

import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {MultiSelect} from "@/components/ui/multi-select";
import {Textarea} from "@/components/ui/textarea";
import {Input} from "@/components/ui/input";
import React, {Fragment, useEffect, useState, useTransition} from "react";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {addPost, updatePost} from "@/actions/posts/actions";
import {PostStatus, PostCategory} from ".prisma/client";

import {Button} from "@/components/ui/button";
import {useCurrentUser} from "@/hooks/use-current-user";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {getImageData, uploadFile} from "@/lib/image-data";

import {QuillConfig} from "@/styles/quill/quill-config";
import ReactQuill, {Quill} from 'react-quill';
import '@/styles/quill/quill.css'
import {ACCEPTED_IMAGE_TYPES, getStatusText} from "@/enum/enums";
import slug from "slug";
import {isSlug} from "validator";
import DetailPageLayout from "@/components/dashboard/detail-page-layout";
import {PageHeadingInside} from "@/components/dashboard/page-heading";
import {AddPostSchema, defaultValuePost, TPost, TAddPostSchema, UpdatePostSchema} from "@/actions/posts/validations";
import {toast} from "sonner";
import { redirect } from 'next/navigation'
import Link from "next/link";
import {EyeIcon} from "lucide-react";
import RelatedLinksControl from "@/components/related-links-control";
import {parseLinkJson} from "@/actions/common/ralated-link-schema";
import {Switch} from "@/components/ui/switch";
import {cn} from "@/lib/utils";
import {SwitchLangInput} from "@/app/(protected)/dashboard/(dashboard)/_components/SwitchLangInput";
import _ from "lodash";
import SettingsFieldSetup from "@/components/dashboard/settings-field-setup";

const AddPost = (props: {
	categories: any[],
	tags: any[],
	post?: TPost | null
}) => {
	const user = useCurrentUser();
	const [isPending, startTransition] = useTransition();
	const [preview, setPreview] = useState(props.post?.image || "");

	const [langState, setLangState] = useState('vi')
	const langViData = AddPostSchema.safeParse(props.post)
	const langEnData = AddPostSchema.safeParse(props.post?.langEn)

	const formVi = useForm<TAddPostSchema>({
		resolver: zodResolver(AddPostSchema),
		defaultValues: langViData.success ? {
			...defaultValuePost,
			...langViData.data,
			categoryIDs: props.post?.categoryIDs || [],
			tagIDs: props.post?.tagIDs || [],
			settings: _.isEmpty(props.post?.settings) ? defaultValuePost.settings : props.post?.settings,
		} : {
			...defaultValuePost,
			authorId: user?.id,
		}
	})
	const formEn = useForm<TAddPostSchema>({
		resolver: zodResolver(AddPostSchema),
		defaultValues: langEnData.success ? {
			...defaultValuePost,
			...langEnData.data,
			categoryIDs: props.post?.categoryIDs || [],
			tagIDs: props.post?.tagIDs || [],
			settings: _.isEmpty(props.post?.settings) ? defaultValuePost.settings : props.post?.settings,
		} : {
			...defaultValuePost,
			authorId: user?.id,
		}
	})

	const onSubmit = async (input: TAddPostSchema) => {
		startTransition(async () => {
			let imageUrl = ''
			if(input.image && typeof input.image === 'object'){
				const resImage = await uploadFile(input.image[0])
				const data = await resImage?.json();
				imageUrl = data.secure_url
			}

			if(props.post){
				const {error} = await updatePost({
					...UpdatePostSchema.parse(formVi.getValues()),
					image: imageUrl || input.image,
					langEn: UpdatePostSchema.parse(formEn.getValues())
				}, props.post.id!)

				if (error) {
					toast.error(error)
					return
				}

				toast.success("Update thành công")
			} else {
				if(langState !== 'en') {
					const {data, error} = await addPost({
						...AddPostSchema.parse(formVi.getValues()),
						image: imageUrl,
						langEn: AddPostSchema.parse(formEn.getValues()),
					})

					if (error) {
						toast.error(error)
						return
					}

					toast.success("Tạo thành công")
					redirect(`/dashboard/posts/${data?.id}`)
				} else {
					toast.error("Vui lòng tạo với tiếng việt trước")
				}
			}
		})
	}

	return (
		<div className="container">
			{['vi', 'en'].map((lang, index) => {
				const form = lang === 'vi' ? formVi : formEn

				return (
					<Form {...form} key={index}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className={cn("", {
								"hidden": langState !== lang
							})}
						>
							<DetailPageLayout>
								<DetailPageLayout.Main>
									<PageHeadingInside
										title={'Bài viết'}
										backUrl={'/dashboard/posts'}
									/>

									<Card className={''}>
										<CardHeader className={'px-0 mx-6 pb-4 mb-4 border-b'}>
											<CardTitle>
												Thông tin
											</CardTitle>
										</CardHeader>

										<CardContent>
											<div className="space-y-4">
												<div className={cn({"hidden": lang === "en"})}>
													<FormField
														control={form.control}
														name="image"
														render={({ field: {onChange, value, ...rest} }) => (
															<FormItem className={'flex flex-col md:flex-row md:gap-5'}>
																<FormLabel className={'flex-shrink-0 md:w-40 md:mt-4'}>
																	Image
																</FormLabel>
																<div className={'space-y-2 flex-grow'}>
																	<Avatar className="w-24 h-24 rounded-none">
																		<AvatarImage src={preview || ""} />
																		<AvatarFallback>Avatar</AvatarFallback>
																	</Avatar>

																	<FormControl>
																		<Input
																			type="file"
																			{...rest}
																			onChange={(event) => {
																				const { files, displayUrl} = getImageData(event)
																				setPreview(displayUrl);
																				onChange(files);
																			}}
																			accept={ACCEPTED_IMAGE_TYPES.join(',')}
																			disabled={isPending}
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
												</div>
												
												<FormField
													control={form.control}
													name="title"
													render={({ field }) => (
														<FormItem className={'flex flex-col md:flex-row md:gap-5'}>
															<FormLabel className={'flex-shrink-0 md:w-40 md:mt-4'}>
																Tiêu đề
															</FormLabel>
															<div className={'space-y-2 flex-grow'}>
																<FormControl>
																	<Input
																		{...field}
																		disabled={isPending}
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
														<FormItem className={'flex flex-col md:flex-row md:gap-5'}>
															<FormLabel className={'flex-shrink-0 md:w-40 md:mt-4'}>
																Slug
															</FormLabel>
															<div className={'space-y-2 flex-grow'}>
																<div className="flex items-center space-x-2">
																	<FormControl>
																		<Input
																			{...field}
																			disabled={isPending}
																			required
																		/>
																	</FormControl>
																	<Button
																		type={'button'}
																		variant={'secondary'}
																		onClick={() => {
																			const sl = slug(form.getValues('title'))
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

												<FormField
													control={form.control}
													name="description"
													render={({ field }) => (
														<FormItem className={'flex flex-col md:flex-row md:gap-5'}>
															<FormLabel className={'flex-shrink-0 md:w-40 md:mt-4'}>
																Mô tả
															</FormLabel>
															<div className={'space-y-2 flex-grow'}>
																<FormControl>
																	<Textarea
																		{...field}
																		disabled={isPending}
																	/>
																</FormControl>
																<FormMessage />
															</div>
														</FormItem>
													)}
												/>

												<FormField
													control={form.control}
													name="metaDescription"
													render={({ field }) => (
														<FormItem className={'flex flex-col md:flex-row md:gap-5'}>
															<FormLabel className={'flex-shrink-0 md:w-40 md:mt-4'}>
																Mô tả SEO
															</FormLabel>
															<div className={'space-y-2 flex-grow'}>
																<FormControl>
																	<Textarea
																		{...field}
																		disabled={isPending}
																	/>
																</FormControl>
																<FormMessage />
															</div>
														</FormItem>
													)}
												/>

												<FormField
													control={form.control}
													name="body"
													render={({ field }) => (
														<FormItem>
															<FormLabel>
																Nội dung
															</FormLabel>
															<div className={'space-y-2 flex-grow'}>
																<FormControl>
																	<ReactQuill
																		className={'prose max-w-none'}
																		theme="snow"
																		disabled={isPending}
																		modules={QuillConfig.modules}
																		{...field}
																	/>
																</FormControl>
																<FormMessage />
															</div>
														</FormItem>
													)}
												/>
											</div>
										</CardContent>
									</Card>
								</DetailPageLayout.Main>
								<DetailPageLayout.Right>
									<div className={'h-20 flex-shrink-0 flex gap-3 items-end justify-end'}>
										<SwitchLangInput checked={langState === 'en'} onClick={() => langState === 'en' ? setLangState('vi') : setLangState('en')} />

										{Boolean(props.post?.status === PostStatus.PUBLISHED) && (
											<Button asChild variant={'outline'}>
												<Link href={`${process.env.NEXT_PUBLIC_APP_URL}/blog/${props.post?.slug}`} target={'_blank'}>
													<EyeIcon className={'size-4 mr-2'}/> View
												</Link>
											</Button>
										)}
										<Button
											type={'submit'}
											disabled={isPending}
										>
											{props.post ? 'Cập nhật' : 'Tạo Bài viết'}
										</Button>
									</div>
									
									<div className={'space-y-4 lg:space-y-8 w-full lg:h-[calc(100vh-8rem)] overflow-auto'}>
										<Card className={'p-6 flex flex-col gap-3 w-full'}>
											<FormField
												control={form.control}
												name="keywords"
												render={({field}) => (
													<FormItem>
														<FormLabel>
															Từ Khóa
														</FormLabel>
														<div className={'space-y-2 flex-grow'}>
															<FormControl>
																<Input
																	{...field}
																	disabled={isPending}
																/>
															</FormControl>
															<FormDescription>Ngăn cách bởi dấu phẩy </FormDescription>
															<FormMessage/>
														</div>
													</FormItem>
												)}
											/>
											
											<div className={cn("flex flex-col gap-3", {"hidden": lang === "en"})}>
												<FormField
													control={form.control}
													name={'status'}
													render={({field}) => (
														<FormItem>
															<FormLabel>Tình trạng</FormLabel>
															<Select
																value={field.value}
																disabled={isPending}
																onValueChange={field.onChange}
															>
																<FormControl>
																	<SelectTrigger className="">
																		<SelectValue placeholder="Tình trạng"/>
																	</SelectTrigger>
																</FormControl>
																<SelectContent>
																	<SelectItem
																		value={PostStatus.PUBLISHED}>{getStatusText(PostStatus.PUBLISHED)}</SelectItem>
																	<SelectItem value={PostStatus.DRAFT}>{getStatusText(PostStatus.DRAFT)}</SelectItem>
																	<SelectItem
																		value={PostStatus.ARCHIVED}>{getStatusText(PostStatus.ARCHIVED)}</SelectItem>
																</SelectContent>
																<FormMessage/>
															</Select>
														</FormItem>
													)}
												/>
												
												<FormField
													control={form.control}
													name={'categoryIDs'}
													render={({field}) => (
														<FormItem>
															<FormLabel>Danh mục</FormLabel>
															<Select
																value={field.value[0]}
																disabled={isPending}
																onValueChange={(v) => {
																	form.setValue('categoryIDs', [v])
																}}
															>
																<FormControl>
																	<SelectTrigger className="">
																		<SelectValue placeholder="Danh mục"/>
																	</SelectTrigger>
																</FormControl>
																<SelectContent>
																	{props.categories.map(c => (
																		<Fragment key={c.slug}>
																			<SelectItem key={c.slug} value={c.id}>{c.name}</SelectItem>
																			{c.childrenCategory.map(x => (
																				<SelectItem className={'pl-6'} key={x.slug} value={x.id}>{x.name}</SelectItem>
																			))}
																		</Fragment>
																	))}
																</SelectContent>
																<FormMessage/>
															</Select>
														</FormItem>
													)}
												/>
												
												<FormField
													control={form.control}
													name="tagIDs"
													render={({field: {...field}}) => (
														<FormItem>
															<FormLabel>
																Tag
															</FormLabel>
															<div className={'space-y-2 flex-grow'}>
																<MultiSelect
																	selected={field.value}
																	options={props.tags.map(e => ({value: String(e.id), label: String(e.name)}))}
																	{...field}
																/>
																<FormMessage/>
															</div>
														</FormItem>
													)}
												/>
												
												<FormField
													control={form.control}
													name="enabledRelated"
													render={({field}) => (
														<FormItem className="">
															<div className="space-y-0.5">
																<FormLabel>Hiện thị bài viết trong danh sách</FormLabel>
																<FormDescription>
																	Bài viết có thể hiện thị ở blog, bài liên quan, tìm kiếm
																</FormDescription>
															</div>
															<FormControl>
																<Switch
																	disabled={isPending}
																	checked={field.value}
																	onCheckedChange={field.onChange}
																/>
															</FormControl>
														</FormItem>
													)}
												/>
											</div>
										</Card>
										
										<Card className={'p-6 flex flex-col gap-3 w-full'}>
											<RelatedLinksControl
												data={form.getValues('relatedLinks')}
												handleChange={(e) => form.setValue('relatedLinks', e)}
											/>
										</Card>
										
										<div className={cn({"hidden": lang === "en"})}>
											<SettingsFieldSetup
												input={form.getValues('settings')}
												handleChange={(e) => form.setValue('settings', e)}
											/>
										</div>
									</div>
								</DetailPageLayout.Right>
							</DetailPageLayout>
						</form>
					</Form>
				)
			})}
		</div>
	)
}

export default AddPost
