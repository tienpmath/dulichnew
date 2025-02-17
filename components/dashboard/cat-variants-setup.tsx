import React, {Fragment, useEffect, useState} from "react";
import {FormControl, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {Input} from "@/components/ui/input";
import {MinusIcon} from "@radix-ui/react-icons";
import {Checkbox} from "@/components/ui/checkbox";

type Props = {
	input: any[],
	handleChange: (e: any[]) => void
}
export default function CatVariantsSetup(props: Props){
	const defaultVariant = {
		slug: 'variant_'+Math.round(Math.random() * 10000),
		name: '',
		langEnName: '',
		value: [],
		langEnValue: [],
		type: '',
		hidden: false,
		priority: '',
	}
	const [data, setData] = useState(props.input.map(d => ({
		...defaultVariant,
		...d,
		langEnValue: d.langEnValue ? d.langEnValue : d.value.map(() => '')
	})))

	useEffect(()=> {
		props.handleChange(data)
	}, [data])

	const handleInput = (inputs: {
		v: any,
		key: string,
		index: number
	}) => {
		const {v,key,index} = inputs

		const t = [...data]
		t[index][key] = v
		setData(t)
	}

	const handleInputArr = (inputs: {
		v: any,
		key: string,
		index: number,
		arrIndex: number,
	}) => {
		const {v,key,index,arrIndex} = inputs

		const t = [...data]
		t[index][key][arrIndex] = v
		setData(t)
	}

	const deleteV = (index: number) => {
		const t = [...data]
		t.splice(index, 1)
		setData(t)
	}

	const deleteVArr = (index: number, arrIndex: number) => {
		const t = [...data]
		t[index].value.splice(arrIndex, 1)
		t[index].langEnValue.splice(arrIndex, 1)

		setData(t)
	}
	const addVArr = (index: number) => {
		const t = [...data]
		t[index].value.push('')
		t[index].langEnValue.push('')
		setData(t)
	}

	return (
		<>
			<FormItem className={'border p-3 rounded-md'}>
				<div className={'font-bold'}>
					Phân loại
				</div>
				<div>
					<div>
						{data.map((x, index) => (
							<div className={'mb-5 border-b pb-4'} key={`${x.slug}_index_${index}`}>
								<div className="flex items-center gap-3 mb-2">
									<p className={'text-sm font-semibold'}>Phân loại {index+1}</p>
									<button
										type={'button'}
										className={'text-sm hover:underline text-red-600'}
										onClick={() => deleteV(index)}
									>Xóa</button>
								</div>
								<div className="grid grid-cols-2 gap-3">
									<div>
										<p className={'text-sm mb-2'}>Tên phân loại</p>
										<Input type={'string'} defaultValue={x.name}
										       onChange={e => handleInput({v: e.target.value, index, key: 'name'})}/>
									</div>
									<div className={''}>
										<p className={'text-sm mb-2'}>Tên Tiếng anh</p>
										<Input type={'string'} defaultValue={x.langEnName}
										       onChange={e => handleInput({v: e.target.value, index, key: 'langEnName'})}/>
									</div>
									<div className={''}>
										<p className={'text-sm mb-2'}>Thứ tự</p>
										<Input type={'number'} defaultValue={x.priority}
										       onChange={e => handleInput({v: e.target.value, index, key: 'priority'})}/>
									</div>
									<div></div>
									<div className={'flex gap-3'}>
										<Checkbox className={'mt-1'} id={`check_${index}`} defaultChecked={x.type === 'options'}
										          onCheckedChange={(c) => handleInput({
											          v: c ? 'options' : 'selection',
											          index,
											          key: 'type'
										          })}/>
										<label htmlFor={`check_${index}`} className={'text-sm'}>Cho phép lựa chọn nhiều</label>
									</div>
									<div className={'flex gap-3'}>
										<Checkbox className={'mt-1'} id={`check_hidden_${index}`} defaultChecked={x.hidden}
										          onCheckedChange={(c) => handleInput({
											          v: c,
											          index,
											          key: 'hidden'
										          })}/>
										<label htmlFor={`check_hidden_${index}`} className={'text-sm'}>Ẩn Lọc</label>
									</div>
								</div>
								
								<div className="pl-7 grid grid-cols-2 gap-3 my-3 relative">
									{x.value.map((v, i) => (
										<Fragment key={`${index}_${i}_${x.slug}`}>
											<Button type={'button'} size={'icon'} className={'size-6 rounded-full absolute left-0'}
											        style={{top: 72 * i + 30}} variant={'ghost'}
											        onClick={() => deleteVArr(index, i)}
											>
												<MinusIcon className={'size-4'}/>
											</Button>
											<div>
												<p className={'text-sm mb-1'}>Giá trị</p>
												<Input type={'string'} defaultValue={String((x.value && x.value.length > 0) ? x.value[i] : "")}
												       onChange={e => handleInputArr({v: e.target.value, index, key: 'value', arrIndex: i})}
												/>
											</div>
											<div>
												<p className={'text-sm mb-1'}>Tiếng anh</p>
												<Input type={'string'} defaultValue={String((x.langEnValue && x.langEnValue.length > 0) ? x.langEnValue[i] : "")}
												       onChange={e => handleInputArr({v: e.target.value, index, key: 'langEnValue', arrIndex: i})}
												/>
											</div>
										</Fragment>
									))}
									<div>
										<button
											type={'button'}
											className={'text-sm hover:underline text-indigo-600'}
											onClick={() => addVArr(index)}
										>Thêm lựa chọn</button>
									</div>
								</div>
							</div>
						))}
					</div>
					<Button
						type={'button'}
						className={cn('flex-shrink-0', {
						})}
						variant={'secondary'}
						onClick={()=> {
							setData([...data, defaultVariant])
						}}
					>
						Thêm phân loại
					</Button>
				</div>
			</FormItem>
		</>
	)
}
