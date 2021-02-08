import { Status } from './components/Date';
import { Settings } from './database';

export const msToBeaufort = (ms: number): number => {
	const bf = Math.ceil(Math.cbrt(Math.pow(ms / 0.836, 2)));
	return bf > 12 ? 12 : bf;
};

const windowWidth = window.innerWidth;

export const randomizeCircularPosition = () => {
	const rx = Math.floor((windowWidth - 48) * 0.5);
	const ry = Math.floor((windowWidth - 48) * 0.5);
	const ra = 30 + (Math.random() * 20);
	const pxr = Math.random();
	const pyr = Math.random();
	return {
		...(pxr < 0.5 ? { left: (rx + ra) + 'px' } : { right: (rx + ra) + 'px' }),
		...(pyr < 0.5 ? { top: (ry + ra) + 'px' } : { bottom: (ry + ra) + 'px' }),
		transform: `translate(${pxr < 0.5 ? '-50%' : '50%'}, ${pyr < 0.5 ? '-50%' : '50%'})`
	};
}

export const parseWeatherStatus = (settings: Settings, forecast: { [key: string]: any }): Status => {
	const { rain = false, temperature: { min = 10, max = 30 } = {}, wind = 4 } = settings;
	const { temp, wind_spd, pop, clouds } = forecast;
	const speedDiff = wind - msToBeaufort(wind_spd);
	let score = 10;
	if (speedDiff < 0) score -= 2;
	if (speedDiff < -2) score -= 2;
	if ((temp - min) < 0 || (temp - max) > 0) score -= 2;
	if ((temp - min) < -4 || (temp - max) > 4) score -= 2;
	if (!rain && clouds > 85) score -= 2;
	if (!rain && pop > 15) score -= 2;
	if (!rain && pop > 40) score -= 2;
	if (rain && pop > 80) score -= 2;
	if (score > 6) return Status.Good;
	if (score <= 3) return Status.Bad;
	return Status.Average;
}