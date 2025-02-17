'use client'
import {ContactSchema, defaultContactValues, TContactSchema} from "@/schemas/contact.schema";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as React from "react";
import {actionSendMail} from "@/actions/mails/actionSendMail";
import {FormError} from "@/components/form-error";
import {FormSuccess} from "@/components/form-success";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {z} from "zod";
import {useLocale, useTranslations} from "next-intl";
import {zodI18nMap} from "zod-i18n-map";
import i18next from "i18next";

export default function ContactFormFooter(){
	const [isPending, startTransition] = React.useTransition()
	const [error, setError] = useState<string | undefined>("");
	const [success, setSuccess] = useState<string | undefined>("");

	const t = useTranslations('contact_form');
	const locale = useLocale();
	i18next.init({lng: locale})
	z.setErrorMap(zodI18nMap);

	const form = useForm<TContactSchema>({
		resolver: zodResolver(ContactSchema),
		defaultValues: defaultContactValues
	})

	function onSubmit(input: TContactSchema){
		setError("")
		setSuccess("")
		startTransition(async () => {
			const {error} = await actionSendMail(input)

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
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<div className={'space-y-2 text-white'}>
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input
										{...field}
										disabled={isPending}
										className={'border-t-0 border-r-0 border-l-0 border-bottom border-white/30 rounded-none placeholder:text-white/80'}
										placeholder={t("name")}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="address"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input
										{...field}
										disabled={isPending}
										className={'border-t-0 border-r-0 border-l-0 border-bottom border-white/30 rounded-none placeholder:text-white/80'}
										placeholder={t("address")}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="phone"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input
										{...field}
										disabled={isPending}
										className={'border-t-0 border-r-0 border-l-0 border-bottom border-white/30 rounded-none placeholder:text-white/80'}
										placeholder={t("phone")}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="note"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Textarea
										{...field}
										disabled={isPending}
										className={'border-t-0 border-r-0 border-l-0 border-bottom border-white/30 rounded-none placeholder:text-white/80'}
										placeholder={t("content")}
										rows={1}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<FormError message={error} />
				<FormSuccess message={success} />
				<Button
					disabled={isPending}
					type="submit"
					className="w-full mt-3"
					variant={'destructive'}
				>
					{t("submit")}
				</Button>
			</form>
		</Form>
	)
}
