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

type FeatureFlagValue = DataTableConfig["featureFlags"][number]["value"]

interface TagsTableContextProps {
	featureFlags: FeatureFlagValue[]
	setFeatureFlags: React.Dispatch<React.SetStateAction<FeatureFlagValue[]>>
}

const TagsTableContext = React.createContext<TagsTableContextProps>({
	featureFlags: [],
	setFeatureFlags: () => {},
})

export function useTagsTable() {
	const context = React.useContext(TagsTableContext)
	if (!context) {
		throw new Error("useTagsTable must be used within a TagsTableProvider")
	}
	return context
}

export function PostTagsTableProvider({ children }: React.PropsWithChildren) {
	const [featureFlags, setFeatureFlags] = React.useState<FeatureFlagValue[]>([])

	return (
		<TagsTableContext.Provider
			value={{
				featureFlags,
				setFeatureFlags,
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
		</TagsTableContext.Provider>
	)
}
