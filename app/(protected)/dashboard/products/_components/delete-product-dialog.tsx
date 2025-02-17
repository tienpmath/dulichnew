"use client"

import * as React from "react"
import { ReloadIcon, TrashIcon } from "@radix-ui/react-icons"
import { type Row } from "@tanstack/react-table"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import {TProductWithRelation} from "@/actions/products/validations";
import {deleteProducts} from "@/actions/products/actions";

interface DeleteProductsDialogProps
	extends React.ComponentPropsWithoutRef<typeof Dialog> {
	records: Row<TProductWithRelation>["original"][]
	showTrigger?: boolean
	onSuccess?: () => void
}

export function DeleteProductsDialog({
	records,
	showTrigger = true,
	onSuccess,
	...props
}: DeleteProductsDialogProps) {
	const [isDeletePending, startDeleteTransition] = React.useTransition()

	return (
		<Dialog {...props}>
			{showTrigger ? (
				<DialogTrigger asChild>
					<Button variant="outline" size="sm">
						<TrashIcon className="mr-2 size-4" aria-hidden="true" />
						Xóa ({records.length})
					</Button>
				</DialogTrigger>
			) : null}
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Bạn có chắc chắn không??</DialogTitle>
					<DialogDescription>
						Hành động này không thể được hoàn tác. Thao tác này sẽ xóa vĩnh viễn xóa {' '}
						<span className="font-medium">{records.length}</span> {' '}
						dữ liệu khỏi máy chủ.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="gap-2 sm:space-x-0">
					<DialogClose asChild>
						<Button variant="outline">Hủy</Button>
					</DialogClose>
					<Button
						aria-label="Delete selected rows"
						variant="destructive"
						onClick={() => {
							startDeleteTransition(async () => {
								const { error } = await deleteProducts({
									ids: records.map((record) => record.id),
								})

								if (error) {
									toast.error(error)
									return
								}

								props.onOpenChange?.(false)
								toast.success("Đã xóa thành công")
								onSuccess?.()
							})
						}}
						disabled={isDeletePending}
					>
						{isDeletePending && (
							<ReloadIcon
								className="mr-2 size-4 animate-spin"
								aria-hidden="true"
							/>
						)}
						Xóa
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
