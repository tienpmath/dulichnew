"use client"

import { ColumnDef } from "@tanstack/react-table"

import {DataTableColumnHeader} from "@/components/data-table/table-header";
import React from "react";
import {Check, CircleCheck, Cloud, Eye, EyeIcon, MoreHorizontal, PencilIcon, SquarePen, Trash} from "lucide-react";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Checkbox} from "@/components/ui/checkbox";
import {parseProductImages, TProductWithRelation} from "@/actions/products/validations";
import {getStatusText} from "@/enum/enums";
import Image from "next/image";
import {Badge} from "@/components/ui/badge";
import {DeleteProductsDialog} from "@/app/(protected)/dashboard/products/_components/delete-product-dialog";
import {ProductStatus} from ".prisma/client";
import {UpdateProductSheet} from "@/app/(protected)/dashboard/products/_components/update-product-sheet";
import {TShortProductConstant} from "@/actions/products/queries";
import CloudImage from "@/components/CloudImage";

export function productTableColumns(): ColumnDef<TProductWithRelation>[] {
	return [
		{
			id: "select",
			header: ({ table }) => (
				<Checkbox
					checked={
						table.getIsAllPageRowsSelected() ||
						(table.getIsSomePageRowsSelected() && "indeterminate")
					}
					onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
					aria-label="Select all"
					className="translate-y-0.5"
				/>
			),
			cell: ({ row }) => (
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={(value) => row.toggleSelected(!!value)}
					aria-label="Select row"
					className="translate-y-0.5"
				/>
			),
			enableSorting: false,
			enableHiding: false,
		},
		{
			id: 'status',
			accessorKey: "status",
			meta: {
				columnName: 'Tình trạng'
			},
			header: ({ column }) => {
				return (
					<DataTableColumnHeader column={column}>Tình trạng</DataTableColumnHeader>
				)
			},
			cell: (props) => {
				const row = props.row
				const item = row.original
				return getStatusText(item.status)
			}
		},
		{
			id: 'image',
			accessorKey: "image",
			enableSorting: false,
			meta: {
				columnName: 'Ảnh'
			},
			header: ({ column }) => {
				return (
					<DataTableColumnHeader column={column}>Ảnh</DataTableColumnHeader>
				)
			},
			cell: (props) => {
				const row = props.row
				const item = row.original

				const url = item.image || parseProductImages(item.images)[0]?.url
				if(!url) return <></>

				return (
					<div className={'w-20 aspect-square relative'}>
						<CloudImage
							src={url || ""}
							alt={item.title || ""}
							width={80} height={80}
							className={'object-cover object-center w-full h-full'}
						/>
					</div>
				)
			}
		},
		{
			id: 'title',
			accessorKey: "title",
			meta: {
				columnName: 'Tiêu đề'
			},
			header: ({ column }) => {
				return (
					<DataTableColumnHeader column={column}>Tiêu đề</DataTableColumnHeader>
				)
			},
		},
		{
			id: 'keywords',
			accessorKey: "keywords",
			header: "Từ khóa",
			meta: {
				columnName: 'Từ khóa'
			},
		},
		{
			accessorKey: "slug",
			header: "Slug",
			enableHiding: true,
			cell: ({row}) => {
				const item = row.original

				if(Boolean(item.status === ProductStatus.PUBLISHED)) {
					return (
						<Link
							href={`${process.env.NEXT_PUBLIC_APP_URL}/san-pham/${item.slug}`} target={'_blank'}
							className={'text-indigo-400'}
						>
							{item.slug}
						</Link>
					)
				}

				return item.slug
			}
		},
		{
			id: 'categories',
			accessorKey: "categories",
			meta: {
				columnName: 'Danh mục'
			},
			header: 'Danh mục',
			cell: ({row}) => {
				const item = row.original

				return (
					<>
						{item.categories.map((it) => (
							<Badge
								key={it.id}
								variant="secondary"
								className="mr-1 mb-1"
							>
								{it.name}
							</Badge>
						))}
					</>
				)
			}
		},
		{
			id: 'tags',
			accessorKey: "tags",
			meta: {
				columnName: 'Tags'
			},
			header: 'Tags',
			cell: ({row}) => {
				const item = row.original

				return (
					<>
						{item.tags.map((it) => (
							<Badge
								key={it.id}
								variant="secondary"
								className="mr-1 mb-1"
							>
								{it.name}
							</Badge>
						))}
					</>
				)
			}
		},
		{
			id: "updatedAt",
			accessorKey: "updatedAt",
			meta: {
				columnName: 'Cập nhật'
			},
			header: ({ column }) => {
				return (
					<DataTableColumnHeader column={column}>Cập nhật</DataTableColumnHeader>
				)
			},
			cell : ({row}) => {
				const item = row.original
				if(!item.updatedAt) return <></>
				return (
					<span>
					{new Date(item.updatedAt).toLocaleString('vi-VN')}
				</span>
				)
			}
		},
		{
			id: "createdAt",
			accessorKey: "createdAt",
			meta: {
				columnName: 'Ngày tạo'
			},
			header: ({ column }) => {
				return (
					<DataTableColumnHeader column={column}>Ngày tạo</DataTableColumnHeader>
				)
			},
			cell : ({row}) => {
				const item = row.original
				if(!item.createdAt) return <></>
				return (
					<span>
					{new Date(item.createdAt).toLocaleString('vi-VN')}
				</span>
				)
			}
		},
		{
			id: "actions",
			cell: function Cell({row}){
				const [isUpdatePending, startUpdateTransition] = React.useTransition()
				const [showUpdateItemSheet, setShowUpdateItemSheet] =
					React.useState(false)
				const [showDeleteItemDialog, setShowDeleteItemDialog] =
					React.useState(false)

				const item = row.original

				return (
					<>
						<UpdateProductSheet
							open={showUpdateItemSheet}
							onOpenChange={setShowUpdateItemSheet}
							product={row.original}
						/>
						<Button
							variant="ghost" className="h-8 w-8 p-0"
						  onClick={() => setShowUpdateItemSheet(true)}
						>
							<PencilIcon className="h-4 w-4" />
						</Button>
						<Button variant="ghost" className="h-8 w-8 p-0" asChild>
							<Link href={`/dashboard/products/${item?.id}`}>
								<SquarePen className="h-4 w-4" />
							</Link>
						</Button>
						<DeleteProductsDialog
							open={showDeleteItemDialog}
							onOpenChange={setShowDeleteItemDialog}
							records={[row.original]}
							showTrigger={false}
							onSuccess={() => row.toggleSelected(false)}
						/>

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" className="h-8 w-8 p-0">
									<span className="sr-only">Open menu</span>
									<MoreHorizontal className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onSelect={() => setShowDeleteItemDialog(true)}
								>
									Xóa
									<DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</>
				)
			}
		}
	]
}
