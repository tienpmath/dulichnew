"use client"

import * as React from "react"

import { dataTableConfig, type DataTableConfig } from "@/config/data-table"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip"
import {DateRangePicker} from "@/components/date-range-picker";
import {TProductCategory} from "@/actions/products/categories/validations";
import {TPostCategory} from "@/actions/posts/categories/validations";

type FeatureFlagValue = DataTableConfig["featureFlags"][number]["value"]

interface CategoriesTableContextProps {
	featureFlags: FeatureFlagValue[]
	setFeatureFlags: React.Dispatch<React.SetStateAction<FeatureFlagValue[]>>,
	categories: TPostCategory[],
	setCategories: React.Dispatch<React.SetStateAction<TPostCategory[]>>
}

const CategoriesTableContext = React.createContext<CategoriesTableContextProps>({
	featureFlags: [],
	setFeatureFlags: () => {},
	categories: [],
	setCategories: () => {},
})

export function useCategoriesTable() {
	const context = React.useContext(CategoriesTableContext)
	if (!context) {
		throw new Error("useCategoriesTable must be used within a CategoriesTableProvider")
	}
	return context
}

export function PostCategoriesTableProvider({ children }: React.PropsWithChildren) {
	const [featureFlags, setFeatureFlags] = React.useState<FeatureFlagValue[]>([])
	const [categories, setCategories] = React.useState<TPostCategory[]>([])

	return (
		<CategoriesTableContext.Provider
			value={{
				featureFlags,
				setFeatureFlags,
				categories,
				setCategories
			}}
		>
			<div className="w-full overflow-x-auto flex items-center justify-between mb-1">
				<ToggleGroup
					type="multiple"
					variant="outline"
					size="sm"
					value={featureFlags}
					onValueChange={(value: FeatureFlagValue[]) => setFeatureFlags(value)}
					className="w-fit"
				>
					{dataTableConfig.featureFlags.map((flag) => (
						<Tooltip key={flag.value} delayDuration={250}>
							<ToggleGroupItem
								value={flag.value}
								className="whitespace-nowrap px-3 text-xs"
								asChild
							>
								<TooltipTrigger>
									<flag.icon
										className="mr-2 size-3.5 shrink-0"
										aria-hidden="true"
									/>
									{flag.label}
								</TooltipTrigger>
							</ToggleGroupItem>
							<TooltipContent
								align="start"
								side="bottom"
								sideOffset={6}
								className="flex max-w-60 flex-col space-y-1.5 border bg-background py-2 font-semibold text-foreground"
							>
								<div>{flag.tooltipTitle}</div>
								<div className="text-xs text-muted-foreground">
									{flag.tooltipDescription}
								</div>
							</TooltipContent>
						</Tooltip>
					))}
				</ToggleGroup>
				<DateRangePicker
					triggerSize="sm"
					triggerClassName="ml-auto w-56 sm:w-60"
					align="end"
				/>
			</div>
			{children}
		</CategoriesTableContext.Provider>
	)
}
