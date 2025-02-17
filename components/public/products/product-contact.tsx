'use client'

import Zoom from "react-medium-image-zoom";
import Image from "next/image";
import * as React from "react";
import OrderButton from "@/components/public/products/order-button";

export default function ProductContact(){
	return (
		<div className={'w-full sm:w-80 bg-white p-4 rounded-md border border-indigo-200 border-opacity-50'}>
			<h4 className={'font-bold'}>Đặt mua sỉ lẻ tại nhóm Zalo</h4>
			<hr className={'gradient-line my-3'}/>
			<Zoom zoomMargin={40}>
				<Image src={'/zalo-card.png'} width={625} height={751} alt={'zalo contact'} />
			</Zoom>

			<OrderButton/>
		</div>
	)
}
