import {
	NavigationMenu, NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList, NavigationMenuTrigger
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import {cn} from "@/lib/utils";
import {usePathname} from "next/navigation";
import {useCurrentRole} from "@/hooks/use-current-role";

export default function NavbarMenu(){
	const pathname = usePathname();
	const role = useCurrentRole();

	return (
		<NavigationMenu className={'hidden lg:flex ml-6'}>
			<NavigationMenuList className={'gap-1'}>
				<NavigationMenuLink
					className={cn('navbar-link', {
						'active': pathname === '/dashboard'
					})}
					asChild
				>
					<Link href="/dashboard">
						Dashboard
					</Link>
				</NavigationMenuLink>
				<NavigationMenuItem>
					<NavigationMenuTrigger
						className={cn('navbar-link', {
							'active': pathname.includes('/dashboard/products')
						})}
					>
						<NavigationMenuLink>
							Sản phẩm
						</NavigationMenuLink>
					</NavigationMenuTrigger>
					<NavigationMenuContent className={'navbar-dropdown'}>
						<NavigationMenuLink asChild>
							<Link
								href="/dashboard/products"
							>
								Danh sách
							</Link>
						</NavigationMenuLink>
						<NavigationMenuLink asChild>
							<Link
								href="/dashboard/products/add"
							>
								Thêm SP
							</Link>
						</NavigationMenuLink>
						<NavigationMenuLink asChild>
							<Link
								href="/dashboard/products/categories"
							>
								Categories
							</Link>
						</NavigationMenuLink>
						<NavigationMenuLink asChild>
							<Link
								href="/dashboard/products/tags"
							>
								Tags
							</Link>
						</NavigationMenuLink>
					</NavigationMenuContent>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuTrigger
						className={cn('navbar-link', {
							'active': pathname.includes('/dashboard/posts')
						})}
					>
						<NavigationMenuLink>
							Bài viết
						</NavigationMenuLink>
					</NavigationMenuTrigger>
					<NavigationMenuContent className={'navbar-dropdown'}>
						<NavigationMenuLink asChild>
							<Link
								href="/dashboard/posts"
							>
								Danh sách
							</Link>
						</NavigationMenuLink>
						<NavigationMenuLink asChild>
							<Link
								href="/dashboard/posts/add"
							>
								Thêm bài
							</Link>
						</NavigationMenuLink>
						<NavigationMenuLink asChild>
							<Link
								href="/dashboard/posts/categories"
							>
								Categories
							</Link>
						</NavigationMenuLink>
						<NavigationMenuLink asChild>
							<Link
								href="/dashboard/posts/tags"
							>
								Tags
							</Link>
						</NavigationMenuLink>
					</NavigationMenuContent>
				</NavigationMenuItem>
				<NavigationMenuLink
					className={cn('navbar-link', {
						'active': pathname.includes('/dashboard/theme')
					})}
					asChild
				>
					<Link href="/dashboard/theme">
						Tùy chỉnh
					</Link>
				</NavigationMenuLink>
				<NavigationMenuLink
					className={cn('navbar-link', {
						'active': pathname.includes('/dashboard/users')
					})}
					asChild
				>
					<Link href="/dashboard/users">
						Người dùng
					</Link>
				</NavigationMenuLink>
			</NavigationMenuList>
		</NavigationMenu>
	)
}
