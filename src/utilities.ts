
export const msToBeaufort = (ms: number): number => {
	const bf = Math.ceil(Math.cbrt(Math.pow(ms / 0.836, 2)));
	return bf > 12 ? 12 : bf;
};
