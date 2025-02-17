import {FormControl, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import React, {useEffect, useState, useTransition} from "react";
import {Input} from "@/components/ui/input";
import {getImageData, uploadFile} from "@/lib/image-data";
import {ACCEPTED_IMAGE_TYPES} from "@/enum/enums";
import {Button} from "@/components/ui/button";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {TrashIcon} from "@radix-ui/react-icons";
import {Reorder, useDragControls, useMotionValue} from "framer-motion";
import {GripIcon} from "lucide-react";
import {useRaisedShadow} from "@/hooks/use-raised-shadow";
import {cn} from "@/lib/utils";
import {TImage} from "@/actions/products/validations";
import CloudImage from "@/components/CloudImage";

type Props = {
	images: string[],
	labels?: string[],
	handleChange: (e: string[]) => void,
	disabledAdd?: boolean,
}
export default function MultiImageUploadSetting(props: Props){
	const [data, setData] = useState(props.images.map((d, index) => ({url: d, index: Math.round(Math.random() * 1000000)})))

	useEffect(()=> {
		props.handleChange(data.map(d => (d.url)))
	}, [data])

	return (
		<>
			<FormItem className={'flex flex-col md:flex-row md:gap-5'}>
				<div className="w-full flex flex-col md:flex-row justify-between gap-5">
					<Reorder.Group  axis="y" values={data} onReorder={setData} className={'grid gap-4 flex-grow'}>
						{data.map((d, index) => (
							<div
								key={d.index}
							>
								{Boolean(props.labels) && (
									<label className={'text-sm mb-2 block'}>{props.labels && props.labels[index]}</label>
								)}
								<Item
									item={d}
									index={index}
									data={data}
									setData={setData}
									disabledAdd
								/>
							</div>
						))}
					</Reorder.Group>
					{!Boolean(props.disabledAdd && data.length >= Number(props.labels?.length)) && (
						<Button
							type={'button'}
							className={cn('flex-shrink-0 sticky top-10', {
							})}
							variant={'secondary'}
							onClick={()=> {
								setData([...data, {url: '', index: Math.round(Math.random() * 1000000)}])
							}}
						>
							Thêm
						</Button>
					)}
				</div>
			</FormItem>
		</>
	)
}

type ItemProps = {
	item: TImage,
	index: number,
	data: TImage[],
	setData: (props: TImage[]) => void,
	disabledAdd?: boolean,
}
const Item = (props: ItemProps) => {
	const {item, index, data, setData} = props
	const [isPending, startTransition] = useTransition();

	const y = useMotionValue(0);
	const dragControls = useDragControls();

	const handleInput = async (event: { target: { files: any; }}) => {
		startTransition(async () => {
			const resImage = await uploadFile(event.target.files![0])
			const d = await resImage?.json();

			const t = [...data]
			t[index].url = String(d?.secure_url)
			setData(t)
		})
	}

	return (
		<Reorder.Item
			value={item}
			id={String(item.index)}
			style={{ y }}
			dragListener={false}
			dragControls={dragControls}
			className={'rounded-md flex gap-2 bg-white'}
		>
			{Boolean(item.url) ? (
				<div className={'w-24 h-24 relative'}>
					<CloudImage
						className="object-cover object-center w-full h-full rounded-none select-none"
						src={item.url || ""}
						width={160}
						height={160}
						alt={'setting-image'}
					/>
				</div>
			) : (
				<Input
					className={'block'}
					type="file"
					accept={ACCEPTED_IMAGE_TYPES.join(',')}
					onChange={e => handleInput(e)}
					disabled={isPending}
				/>
			)}
			<div className="flex gap-1 ">
				<Button
					type={'button'}
					size={'icon'}
					className={'w-8 h-8'}
					variant={'secondary'}
					onClick={()=> {
						const t = [...data]
						t.splice(index, 1)
						setData(t)
					}}
				>
					<TrashIcon className={'size-4'}/>
				</Button>

				<Button
					type={'button'}
					size={'icon'}
					variant={'secondary'}
					className={'cursor-grab w-8 h-8'}
					onPointerDown={(event) => dragControls.start(event)}
				>
					<GripIcon
						className={'size-4'}
					/>
				</Button>

			</div>
		</Reorder.Item>
	)
}

