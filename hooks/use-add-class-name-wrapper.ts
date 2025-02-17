"use client"
import {useEffect} from "react";

export default function useAddClassNameWrapper(className: string) {
	useEffect(() => {
		const wrapperBody = document.querySelector('.wrapper-body')
		if(wrapperBody){
			wrapperBody.classList.add(className)
		}
		return () => {
			wrapperBody?.classList.remove(className)
		}
	}, [])
}
