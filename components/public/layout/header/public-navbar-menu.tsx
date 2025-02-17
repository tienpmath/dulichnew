'use client'

import {
	NavigationMenu, NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList, NavigationMenuTrigger
} from "@/components/ui/navigation-menu";
import {Link} from "@/navigation";
import {cn} from "@/lib/utils";
import {usePathname} from "next/navigation";
import {useCurrentRole} from "@/hooks/use-current-role";
import React from "react";
import {CaretDownIcon, HomeIcon} from "@radix-ui/react-icons";

export default function PublicNavbarMenu(props: {
	menuData: any[],
}){
	const pathname = usePathname();
	const role = useCurrentRole();

	return (
		<div className={''}>
			<NavigationMenu className={cn('mx-auto font-semibold max-w-6xl capitalize hidden justify-start lg:flex py-2', {
			})}>
				<NavigationMenuList className={'gap-4 -ml-4'}>
					{props.menuData.map(item => (
						<div key={item.title} className={cn('relative', {
							'group/item': Boolean(item.children)
						})}>
							<NavigationMenuLink
								className={cn('transition-all uppercase duration-150 hover:opacity-75 pl-4 py-1 block', {
									'text-blue-600': pathname === item.url
								})}
								asChild
							>
								<Link href={item.url} className={'flex items-center gap-1'}>
									{item.url === '/' ? (
										<>
											<HomeIcon className={'size-5'} />
										</>
									) : (
										<>
											<span>{item.title}</span>
											{Boolean(item.children) && (
												<CaretDownIcon className={'size-5 group-hover/item:rotate-180 transition-transform'} />
											)}
										</>
									)}
								</Link>
							</NavigationMenuLink>
							{Boolean(item.children) && (
								<>
									<div
										className={cn(
											'opacity-0 scale-95 pointer-events-none transition-all duration-200 ease-in-out absolute top-full pt-2 transform group-hover/item:opacity-100 group-hover/item:scale-100 group-hover/item:pointer-events-auto',
											{
												'left-0': !Boolean(item?.dropdown_right),
												'right-0': Boolean(item?.dropdown_right),
											}
										)}
									>
										<div className="flex flex-col min-w-48 bg-white rounded shadow-md py-3 text-sm font-medium">
											{item.children.map((it) => (
												<Link
													key={it.title}
													href={it.url}
													target={it?.target}
													className="hover:underline px-5 py-2 text-nowrap whitespace-nowrap transition-all"
												>
													{it.title}
												</Link>
											))}
										</div>
									</div>
								</>
							)}
						</div>
					))}
				</NavigationMenuList>
			</NavigationMenu>
		</div>
	)
}
