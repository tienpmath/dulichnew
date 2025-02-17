"use client"

import {
	FacebookIcon,
	FacebookShareButton,
	TelegramShareButton,
	EmailShareButton,
	TwitterShareButton,
	XIcon,
	TelegramIcon, EmailIcon
} from "react-share";
import * as React from "react";

export default function ShareProductButtons(props: {
	href: string
}){
	return(
		<div className={'flex gap-3'}>
			<p className="font-bold">Share: </p>
			<div>
				<FacebookShareButton url={props.href}>
					<FacebookIcon className={'size-7'}/>
				</FacebookShareButton>
				<TwitterShareButton url={props.href}>
					<XIcon className={'size-7'}/>
				</TwitterShareButton>
				<TelegramShareButton url={props.href}>
					<TelegramIcon className={'size-7'}/>
				</TelegramShareButton>
				<EmailShareButton url={props.href}>
					<EmailIcon className={'size-7'}/>
				</EmailShareButton>
			</div>
		</div>
	)
}
