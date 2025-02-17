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

type TImageText = {
	text: string,
	imageUrl: string
}
type TImageTextIndex = TImageText & {
	index: number
}
type Props = {
	data: TImageText[],
	labels?: string[],
	handleChange: (e: TImageText[]) => void,
	disabledAdd?: boolean,
}
export default function MultiImageUploadSettingLink(props: Props){
	const [data, setData] = useState(props.data.map((d, index) => ({...d, index: Math.round(Math.random() * 1000000)})))

	useEffect(()=> {
		props.handleChange(data)
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
								setData([...data, {text: '', imageUrl: '', index: Math.round(Math.random() * 1000000)}])
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
	item: TImageTextIndex,
	index: number,
	data: TImageTextIndex[],
	setData: (props: TImageTextIndex[]) => void,
	disabledAdd?: boolean,
}
const Item = (props: ItemProps) => {
	const {item, index, data, setData} = props
	const [isPending, startTransition] = useTransition();

	const y = useMotionValue(0);
	const dragControls = useDragControls();

	const handleInputImage = async (event: { target: { files: any; }}) => {
		startTransition(async () => {
			const resImage = await uploadFile(event.target.files![0])
			const d = await resImage?.json();

			const t = [...data]
			t[index].imageUrl = String(d?.secure_url)
			setData(t)
		})
	}

	const handleInputText = async (value: string) => {
		const t = [...data]
		t[index].text = value
		setData(t)
	}

	return (
		<Reorder.Item
			value={item}
			id={String(item.index)}
			style={{ y }}
			dragListener={false}
			dragControls={dragControls}
			className={'rounded-md flex flex-col gap-2 bg-white'}
		>
			<div className={'space-y-2'}>
				{Boolean(item.imageUrl) ? (
					<div className={'w-24 h-24 relative'}>
						<CloudImage
							className="object-cover object-center w-full h-full rounded-none select-none"
							src={item.imageUrl || ""}
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
						onChange={e => handleInputImage(e)}
						disabled={isPending}
					/>
				)}
				<div>
					<Input className={'min-h-0'} value={item.text} onChange={e => handleInputText(e.target.value)} placeholder={'Nhập link nếu cần'}/>
				</div>
			</div>

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

