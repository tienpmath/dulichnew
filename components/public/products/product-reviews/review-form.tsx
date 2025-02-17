'use client'

import * as React from "react";
import {useState} from "react";
import {useLocale, useTranslations} from "next-intl";
import i18next from "i18next";
import {z} from "zod";
import {zodI18nMap} from "zod-i18n-map";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {FormError} from "@/components/form-error";
import {FormSuccess} from "@/components/form-success";
import {Button} from "@/components/ui/button";
import {
	createProductCommentSchema,
	defaultProductComment,
	TCreateProductCommentSchema
} from "@/actions/products/rate/validations";
import {addProductComment} from "@/actions/products/rate/actions";
import {TProductWithRelation} from "@/actions/products/validations";
import StarRatings from "react-star-ratings";

export default function ReviewForm({product}: {
	product: TProductWithRelation
}){
	const [isPending, startTransition] = React.useTransition()
	const [error, setError] = useState<string | undefined>("");
	const [success, setSuccess] = useState<string | undefined>("");

	const t = useTranslations('reviews');
	const locale = useLocale();
	i18next.init({lng: locale})
	z.setErrorMap(zodI18nMap);

	const form = useForm<TCreateProductCommentSchema>({
		resolver: zodResolver(createProductCommentSchema),
		defaultValues: defaultProductComment
	})

	function onSubmit(input: TCreateProductCommentSchema){
		setError("")
		setSuccess("")
		startTransition(async () => {
			const {error} = await addProductComment({
				...input,
				productId: product.id
			})

			if(error){
				setError(error)
				return
			}

			form.reset()
			setSuccess(t('success_message'))
		})
	}


	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className={'border-2 border-indigo-900 p-5 my-2 space-y-3 rounded'}>
				<h3 className="text-xl text-block font-medium">{t("add_review")}</h3>
				<div className={'space-y-2'}>
					<FormField
						control={form.control}
						name="rate"
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									{t("rating")}
								</FormLabel>
								<div>
									<StarRatings
										rating={Number(form.getValues('rate'))}
										changeRating={(rating) => form.setValue('rate', rating)}
										starRatedColor={'#c6f522'} starDimension={'34px'} starSpacing={'4px'}
									/>
								</div>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="comment"
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									{t("review")}
								</FormLabel>
								<FormControl>
									<Textarea
										{...field}
										disabled={isPending}
										className={''}
										required
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="grid grid-cols-2 gap-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										{t("name")}
									</FormLabel>
									<FormControl>
										<Input
											{...field}
											disabled={isPending}
											className={''}
											required
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										{t("email")}
									</FormLabel>
									<FormControl>
										<Input
											{...field}
											disabled={isPending}
											className={''}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</div>
				<FormError message={error} />
				<FormSuccess message={success} />
				<Button
					disabled={isPending}
					type="submit"
					className="rounded !mt-5 uppercase bg-indigo-900 hover:bg-indigo-800"
					variant={'destructive'}
				>
					{t("submit")}
				</Button>
			</form>
		</Form>
	)
}
