import {FaPhoneVolume, FaTags} from "react-icons/fa6";
import {MdLocalShipping} from "react-icons/md";
import {HiCheckBadge} from "react-icons/hi2";

export default function FooterFeatures(){
	const data = [
		{
			icon: <FaTags className={'size-7'} />,
			title: 'Nhà cung cấp thiết bị vệ sinh',
			subtitle: 'Hàng đầu hiện nay'
		},
		{
			icon: <MdLocalShipping className={'size-8'} />,
			title: 'Giao hàng',
			subtitle: 'Vận chuyển toàn quốc'
		},
		{
			icon: <FaPhoneVolume className={'size-7'} />,
			title: 'Hotline đặt hàng',
			subtitle: '0987654322'
		},
		{
			icon: <HiCheckBadge className={'size-8'} />,
			title: 'thanh toán bảo mật',
			subtitle: 'Uy tín, nhanh chóng'
		}
	]
	return (
		<div className={'py-5'}>
			<div className={'container mx-auto max-w-[1400px] px-5 hidden xl:flex justify-between'}>
				{data.map(f => (
					<div key={f.title} className={'flex gap-3 items-center w-fit'}>
						<div className={'flex-shrink-0 border-2 rounded-full aspect-square text-gray-800 border-gray-500 size-14 flex items-center justify-center'}>
							{f.icon}
						</div>
						<div>
							<p className={'uppercase font-bold'}>{f.title}</p>
							<p>{f.subtitle}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
