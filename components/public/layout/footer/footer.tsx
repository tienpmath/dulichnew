import {Link} from "@/navigation";
import siteMetadata from "@/config/siteMetadata";
import SiteLogo from "@/components/public/logo.site";
import {MailIcon, PhoneCallIcon} from "lucide-react";
import ContactFormFooter from "@/components/public/contact/contact-form-footer";
import {useTranslations} from "next-intl";

export default function Footer(){
	const t = useTranslations();

	return (
		<footer className="footer bg-tascaSecond text-white relative overflow-hidden">
			<div className={'relative z-10 text-white'}>
				<div className="container flex lg:gap-6 justify-between max-lg:flex-col items-start pt-10 pb-5">
					<div className={'space-y-2 max-w-80'}>
						<div className="mb-5">
							<SiteLogo sizeLg dark/>
						</div>
						<p className="uppercase font-semibold">{t("footer.info.company")}</p>
						<p className="uppercase font-semibold">{t("footer.info.contact_info")}</p>
						<p className={'flex items-center'}><PhoneCallIcon
							className={'size-4 mr-2 opacity-80'}/> Hotline: {siteMetadata.hotline_s}</p>
						<p className={'flex items-center'}><MailIcon
							className={'size-4 mr-2 opacity-80'}/> Email: {siteMetadata.owner_email}</p>
					</div>
					<div className={'space-y-2 mt-10'}>
						<h4 className="mb-5 uppercase text-base font-semibold">
							{t("products.name")}
						</h4>
						<ul className={'list-disc list-inside space-y-1.5'}>
							<li>
								<Link href={'/chau-bep'} className={'hover:underline'}>
									{t("products.kitchen_sinks")}
								</Link>
							</li>
							<li>
								<Link href={'/voi-bep'} className={'hover:underline'}>
									{t("products.kitchen_faucets")}
								</Link>
							</li>
							<li>
								<Link href={'/phu-kien'} className={'hover:underline'}>
									{t("products.accessory")}
								</Link>
							</li>
							<li>
								<Link href={'/blog/may-loc-nuoc'} className={'hover:underline'}>
									{t("products.others")}
								</Link>
							</li>
						</ul>
					</div>
					<div className={'space-y-2 mt-10'}>
						<h4 className="mb-5 uppercase text-base font-semibold">
							{t("footer.news.name")}
						</h4>
						<ul className={'list-disc list-inside space-y-1.5'}>
							<li>
								<Link href={'/tuyen-dung'} className={'hover:underline'}>
									{t("footer.news.recruitment")}
								</Link>
							</li>
							<li>
								<Link href={'/cam-nang'} className={'hover:underline'}>
									{t("footer.news.product_manual")}
								</Link>
							</li>
							<li>
								<Link href={'/khuyen-mai'} className={'hover:underline'}>
									{t("footer.news.promotion")}
								</Link>
							</li>
						</ul>
					</div>
					<div className={'space-y-2 mt-10'}>
						<h4 className="mb-5 uppercase text-base font-semibold">
							{t("footer.support.name")}
						</h4>
						<ul className={'list-disc list-inside space-y-1.5'}>
							<li>
								<Link href={'/thu-vien'} className={'hover:underline'}>
									{t("footer.support.library")}
								</Link>
							</li>
						</ul>
					</div>
					<div className={'space-y-2 mt-10 w-64'}>
						<h4 className="mb-5 uppercase text-base font-semibold">
							{t("footer.contact")}
						</h4>
						<ContactFormFooter/>
					</div>
				</div>
				<div className="container">
					<hr className={'border-t border-white/30 my-5'}/>
					<p className={'text-sm text-center pb-5'}>
						Copyright © {new Date().getFullYear()} <a className={'hover:underline'} href={siteMetadata.domain.startsWith('https://') ? siteMetadata.domain : `https://${siteMetadata.domain}`} target={'_blank'}>{siteMetadata.domain}</a>
					</p>
				</div>
			</div>
		</footer>
	)
}
