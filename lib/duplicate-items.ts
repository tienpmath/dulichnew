export default function duplicateItems(arr: any[], minLength: number) {
	if (arr.length >= minLength) {
		return arr; // Array is already long enough
	}
	
	const result: any[] = [];
	let i = 0;
	while (result.length < minLength) {
		result.push(arr[i % arr.length]);
		i++;
	}
	
	return result;
}
