import {Metadata} from "next";
import siteMetadata from "@/config/siteMetadata";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {Link} from "@/navigation";
import {PhoneCallIcon} from "lucide-react";
import * as React from "react";

export const metadata: Metadata = {
	title: 'Liên hệ',
	description: 'Hãy liên hệ với chúng tôi ngay hôm nay để được tư vấn và báo giá tốt nhất!',
	openGraph: {
		title: 'Liên hệ',
		description: 'Hãy liên hệ với chúng tôi ngay hôm nay để được tư vấn và báo giá tốt nhất!',
		images: `${siteMetadata.ogImage}`
	}
}

export default function Page(){
	return (
		<div className="min-h-[50vh] container grid grid-cols-1 justify-start gap-8">
			<h1 className="text-3xl font-semibold">Liên hệ</h1>
			<p>Cảm ơn bạn đã quan tâm đến sản phẩm và dịch vụ của chúng tôi!</p>

			<div className="grid lg:grid-cols-2 gap-5 lg:gap-8 my-5">
				<div className="bg-white rounded">
					<div className="mx-auto p-5 py-8 max-w-md text-center flex gap-4 flex-col items-center justify-center">
						<Image src={'/contact/communications.png'} alt={'tu van'} width={80} height={80}/>
						<div className="space-y-3">
							<p className="text-lg font-semibold">
								Tư vấn khách hàng
							</p>
							<p className={'font-medium'}>Quan tâm đến sản phẩm của chúng tôi? Chỉ cần nhấc máy và gọi cho chúng tôi.</p>
						</div>
						<Button asChild className={'uppercase w-40 bg-red-600 hover:bg-red-500 p-5 my-2'} variant={'primary'}>
							<a href={`${siteMetadata.social.zalo}`} target={'_blank'}>
								<PhoneCallIcon className={'size-4 mr-2'}/> Liên hệ
							</a>
						</Button>
					</div>
				</div>
				<div className="bg-white rounded">
					<div className="mx-auto p-5 py-8 max-w-md text-center flex gap-4 flex-col items-center justify-center">
						<Image src={'/contact/location.png'} alt={'location'} width={80} height={80}/>
						<div className="space-y-3">
							<p className="text-lg font-semibold">
								Hỗ trợ kĩ thuật
							</p>
							<p className={'font-medium'}>Đôi khi bạn cần một chút trợ giúp. Đừng lo lắng, chúng tôi ở đây vì bạn.</p>
						</div>
						<Button asChild className={'uppercase w-40 bg-red-600 hover:bg-red-500 p-5 my-2'} variant={'primary'}>
							<a href={`${siteMetadata.social.zalo}`} target={'_blank'}>
								<PhoneCallIcon className={'size-4 mr-2'}/> Hotline
							</a>
						</Button>
					</div>
				</div>
			</div>

			<div className="prose max-w-3xl w-full break-words">
				<h3>Chúng tôi cam kết:</h3>
				<ul>
					<li>Trả lời mọi thắc mắc của bạn trong thời gian sớm nhất.</li>
					<li>Cung cấp thông tin chính xác và đầy đủ.</li>
					<li>Hỗ trợ bạn tận tình trong suốt quá trình mua hàng và kinh doanh.</li>
				</ul>
				<p>Hãy liên hệ với chúng tôi ngay hôm nay để được tư vấn và báo giá tốt nhất!</p>
			</div>
		</div>
	)
}
