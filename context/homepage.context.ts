import {createContext} from "react";

export const initValues: {
	selectedCat: string,
	onSelectCat: (val: string) => void
	categories: any[]
} = {
	selectedCat: '',
	onSelectCat: () => {},
	categories: []
}
export const HomepageContext = createContext(initValues)
