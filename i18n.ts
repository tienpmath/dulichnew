import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';

export const locales = ['vi', 'en'];

export default getRequestConfig(async ({locale}) => {
	if (!locales.includes(locale as any)) notFound();

	return {
		messages: (await import(`@/locales/${locale}/messages.json`)).default
	};
});
