'use client'

import React, {createContext, useContext, useState} from "react";

export type TNewOrderInfo = {
	id: string,
	order_code: string,
	total: string,
	customer_phone: string,
}

type TDashboardValues = {
	newOrder: TNewOrderInfo
	setNewOrder: React.Dispatch<React.SetStateAction<TNewOrderInfo>>
}

const initValues: TDashboardValues = {
	newOrder: {
		id: '',
		order_code: '',
		total: '',
		customer_phone: '',
	},
	setNewOrder: () => undefined
}

const DashboardContext = createContext(initValues)

export const DashboardProvider = (props: {children: React.ReactNode}) => {
	const [newOrder, setNewOrder] = useState<TNewOrderInfo>(initValues.newOrder)

	return <DashboardContext.Provider value={{
		newOrder,
		setNewOrder,
	}}>{props.children}</DashboardContext.Provider>
}

export const useDashboardContext = () => {
	return useContext(DashboardContext)
}
