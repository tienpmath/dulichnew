import React, {useEffect, useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {CheckIcon, CopyIcon, TrashIcon} from "@radix-ui/react-icons";
import {Reorder, useDragControls, useMotionValue} from "framer-motion";
import {GripIcon} from "lucide-react";
import {useRaisedShadow} from "@/hooks/use-raised-shadow";
import {cn} from "@/lib/utils";
import {Textarea} from "@/components/ui/textarea";

type Props = {
	data: string[],
	labels?: string[],
	handleChange: (e: string[]) => void,
	disabledAdd?: boolean
}
export default function MultiTextInputSetting(props: Props){
	const [data, setData] = useState(props.data.map((d, index) => ({text: d, index: Math.round(Math.random() * 1000000)})))

	useEffect(()=> {
		props.handleChange(data.map(d => (d.text)))
	}, [data])

	return (
		<div className="w-full flex flex-col md:flex-row justify-between gap-5">
			<Reorder.Group axis="y" values={data} onReorder={setData} className={'grid gap-2 flex-grow'}>
				{data.map((d, index) => (
					<div
						key={d.index}
					>
						{Boolean(props.labels) && (
							<label className={'text-sm mb-2 block'}>{props.labels && props.labels[index]}</label>
						)}
						<Item
							key={d.index}
							item={d}
							index={index}
							data={data}
							setData={setData}
						/>
					</div>
				))}
			</Reorder.Group>

			{!Boolean(props.disabledAdd) && (
				<Button
					type={'button'}
					className={cn('flex-shrink-0 sticky top-10', {
					})}
					variant={'secondary'}
					onClick={()=> {
						setData([...data, {text: '', index: Math.round(Math.random() * 1000000)}])
					}}
				>
					Thêm
				</Button>
			)}
		</div>
	)
}

type TextIndex = {
	text: string, index: number
}
type ItemProps = {
	item: TextIndex,
	index: number,
	data: TextIndex[],
	setData: (props: TextIndex[]) => void
}
const Item = ({item, index, data, setData}: ItemProps) => {
	const y = useMotionValue(0);
	const boxShadow = useRaisedShadow(y);
	const dragControls = useDragControls();

	const handleInput = async (value: string) => {
		const t = [...data]
		const values = value.split('\n').filter(t => t.length > 0)
		if(values.length > 1){
			// populate fields
			const temp: TextIndex[] = []
			for (let i = 0; i < Math.floor(values.length/2); i++) {
				temp.push({
					index: Math.round(Math.random() * 1000000),
					text: values[i*2] || '',
				})
			}
			setData(t.slice(0, index).concat(temp))
		} else {
			t[index].text = value
			setData(t)
		}
	}

	return (
		<Reorder.Item
			value={item}
			id={String(item.index)}
			style={{ y }}
			dragListener={false}
			dragControls={dragControls}
			className={'flex flex-col gap-1 mb-2'}
		>
			{/*<Textarea rows={2} className={'min-h-0'} value={item.text} onChange={e => handleInput(e.target.value)} placeholder={'Tiêu đề'}/>*/}
			<Input className={'min-h-0'} value={item.text} onChange={e => handleInput(e.target.value)} placeholder={'Tiêu đề'}/>
			<div className="flex gap-1">
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

