import {z} from "@/locales/zod-custom"
import validator from "validator";

export const CheckoutSchema = z.object({
	name: z.string().min(2).max(200),
	phone: z.string().refine((phone) => {
		return validator.isMobilePhone(phone!, 'vi-VN')
	}, {
		message: 'Số điện thoại không hợp lệ '
	}),
	email: z.optional(z.string().email()),
	address: z.string().min(8).max(500),
	note: z.optional(z.string().max(1000))
})
export type TCheckoutSchema = z.infer<typeof CheckoutSchema>
