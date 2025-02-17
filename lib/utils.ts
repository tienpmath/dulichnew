import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// const breakpoints = {
//   "xs": { "min": 0, "max": 575 },
//   "sm": { "min": 576, "max": 767 },
//   "md": { "min": 768, "max": 991 },
//   "lg": { "min": 992, "max": 1199 },
//   "xl": { "min": 1200, "max": 1399 },
//   "xxl": { "min": 1400, "max": null }
// };
const breakpoints = {
  "sm": { "min": 0, "max": 767 },
  "lg": { "min": 768, "max": 1399 },
  "xxl": { "min": 1400, "max": null }
};
export const transformWidth = (props: {
  originalWidth: number, windowWidth: number, sizesString?: string
}): number => {
  const {originalWidth, windowWidth, sizesString: sizes} = props
  let width = originalWidth

  if (sizes) {
    const sizeEntries = sizes.split(',').map(entry => entry.trim());

    for (let entry of sizeEntries) { // Changed 'const' to 'let' for entry
      const lastSpaceIndex = entry.lastIndexOf(' ');
      const mediaQuery = entry.substring(0, lastSpaceIndex).trim();
      const size = entry.substring(lastSpaceIndex + 1).trim()

      if (!size) continue;

      const maxWidthMatch = mediaQuery.match(/\(max-width:\s*(\d+)px\)/);

      if (maxWidthMatch && windowWidth <= parseInt(maxWidthMatch[1])) {
        const percentage = parseFloat(size.replace('vw', '')) / 100;
        width = windowWidth * percentage;
        break;
      } else if (!mediaQuery.includes('max-width') && !mediaQuery.includes('min-width')) {
        const percentage = parseFloat(size.replace('vw', '')) / 100;
        width = windowWidth * percentage;
      }
    }
  } else if (breakpoints){
    for (const breakpoint in breakpoints) {
      const { min, max } = breakpoints[breakpoint];
      if (windowWidth >= min && (max === null || windowWidth <= max)) {
        if(max < originalWidth && max > 0) {
          width = max-100
        }
        break;
      }
    }
  }

  return Math.round(width) > originalWidth ? originalWidth : Math.round(width);
}
