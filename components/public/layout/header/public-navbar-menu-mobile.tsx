'use client'
import {Link} from "@/navigation";
import {Button} from "@/components/ui/button";
import React, {Fragment, useState} from "react";

import {
	Sheet,
	SheetContent,
	SheetTrigger,
} from "@/components/ui/sheet"
import {MinusIcon, PlusIcon} from "@radix-ui/react-icons";
import {cn} from "@/lib/utils";
import {ScrollArea} from "@/components/ui/scroll-area";
import {IoMenu, IoMenuOutline} from "react-icons/io5";
import SwitchLangButton from "@/components/public/layout/header/switch-lang-button";


export default function PublicNavbarMenuMobile(props: {
	menuData: any[],
}){
	const [activeIndex, setActiveIndex] = useState<number|null>(null)
	const [open, setOpen] = useState(false)

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger>
				<Button size={'icon'} variant={'ghost'} className={'lg:hidden'} asChild>
					<IoMenuOutline className={'!size-8'} />
				</Button>
			</SheetTrigger>
			<SheetContent side={'left'} className={'!max-w-72 flex p-0 border-none font-bold text-cyan-900'}>
				<ScrollArea className={'flex-grow'}>
					<div className="mt-10">
						{props.menuData.map((item, index) => (
							<div key={item.title} className={cn('relative group border-b border-gray-100', {
							})}>
								<div className="flex">
									<Link onClick={() => setOpen(false)} href={item.url} className={'block flex-grow w-full p-4 uppercase hover:text-green-400 transition-colors'}>
										{item.title}
									</Link>
									{Boolean(item.children) && (
										<button className={'aspect-square hover:opacity-80 w-10 flex items-center justify-center'} onClick={() => activeIndex !== index ? setActiveIndex(index) : setActiveIndex(null)}>
											{Boolean(activeIndex === index) ? <MinusIcon className={'size-5'}/> : <PlusIcon className={'size-4'}/>}
										</button>
									)}
								</div>

								{Boolean(item.children) && (activeIndex === index) && (
									<>
										<div className={'pl-5'}>
											{item.children.map(it => (
												<Link onClick={() => setOpen(false)} key={it.title} href={it.url}
												      className={'block w-full p-4 uppercase hover:text-green-400 transition-colors'}>
													{it.title}
												</Link>
											))}
										</div>
									</>
								)}
							</div>
						))}
					</div>

					<div className="flex items-center mx-auto w-fit px-5 mt-8 m-28">
						<SwitchLangButton full/>
					</div>
				</ScrollArea>
			</SheetContent>
		</Sheet>
	)
}
