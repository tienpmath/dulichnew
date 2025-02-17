import { type DataTableConfig } from "@/config/data-table"
import {Prisma} from ".prisma/client";

export function filterColumn({
  column,
  value,
  isSelectable,
  relation,
}: {
  column: string
  value: string
  isSelectable?: boolean,
  relation?: {
    filterKey: string
  }
}) {
  if(typeof value !== "string") return {}

  const [filterValue, filterOperator] = (value?.split("~").filter(Boolean) ??
    []) as [
    string,
    DataTableConfig["comparisonOperators"][number]["value"] | undefined,
  ]

  if (!filterValue) return {}

  if(relation){
    const filters = filterValue.split(/[.,]/g)

    switch (filterOperator) {
      case "notIn":
        return {[column]: {
          some: {
            [relation.filterKey]: {
              notIn: filters
            }
          }
        }}
      case "not":
        return {AND: filters.map(v => ({
            [column]: {
              some: {
                [relation.filterKey]: {not: v}
              }
            }
          }))}
      case "equals":
        return {AND: filters.map(v => ({
            [column]: {
              some: {
                [relation.filterKey]: v
              }
            }
          }))}
      default:
      case "in":
        return {[column]: {
          some: {
            [relation.filterKey]: {
              in: filters
            }
          }
        }}
    }
  }

  if (isSelectable) {
    switch (filterOperator) {
      case "in":
        return {[column]: {in: filterValue.split(/[.,]/g)}}
      case "notIn":
        return {[column]: {notIn: filterValue.split(/[.,]/g)}}
      case "not":
        return {[column]: {not: filterValue}}
      case "equals":
      default:
        return {[column]: {equals: filterValue}}
    }
  }

  switch (filterOperator) {
    case "equals":
      return {[column]: {equals: filterValue, mode: 'insensitive'}}
    case "in":
      return {[column]: {in: filterValue.split(/[.,]/g), mode: 'insensitive'}}
    case "notIn":
      return {[column]: {notIn: filterValue.split(/[.,]/g), mode: 'insensitive'}}
    case "lt":
      return {[column]: {lt: filterValue, mode: 'insensitive'}}
    case "lte":
      return {[column]: {lte: filterValue, mode: 'insensitive'}}
    case "gt":
      return {[column]: {gt: filterValue, mode: 'insensitive'}}
    case "gte":
      return {[column]: {gte: filterValue, mode: 'insensitive'}}
    case "contains":
      return {[column]: {contains: filterValue, mode: 'insensitive'}}
    case "startsWith":
      return {[column]: {startsWith: filterValue, mode: 'insensitive'}}
    case "endsWith":
      return {[column]: {endsWith: filterValue, mode: 'insensitive'}}
    case "not":
      return {[column]: {not: filterValue, mode: 'insensitive'}}
    default:
      return {[column]: {contains: filterValue, mode: 'insensitive'}}
  }
}
