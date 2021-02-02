import React, { createRef, RefObject, useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { createStyles, fade, makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import { TweenLite, Power1 } from 'gsap';
import clsx from 'clsx';
import Date, { Status } from '../../components/Date';
import ForecastDetails from '../../components/ForecastDetails';
import { getForecast, getSettings, Settings } from '../../database';
import { parseWeatherStatus } from '../../utilities';

// @ts-ignore
const useStyles = makeStyles(({ spacing, palette }: Theme) =>
	createStyles({
		root: {},
		container: {
			display: 'flex',
			justifyContent: 'center',
			padding: spacing(3, 4, 2),
			color: palette.text.primary
		},
		week: {
			width: 'calc(100% / 3)',
			display: 'grid',
			gridGap: 14,
			padding: spacing(2, 1.75, 3),
			borderRadius: 6,
			'&:nth-child(1)': {
				backgroundColor: fade(palette.secondary.main, 0.06),
				'& > $weekNumber': {
					color: palette.secondary.main
				}
			}
		},
		weekNumber: {
			textAlign: 'center',
			fontSize: 18,
			fontWeight: 800,
			color: fade(palette.secondary.main, 0.4)
		},
		detailsContainer: {
			visibility: 'hidden'
		},
		details: {
			position: 'absolute',
			height: '100vh',
			width: '100vw',
			top: 0,
			left: 0,
			padding: spacing(3),
			backgroundColor: palette.background.paper,
			// @ts-ignore
			position: 'fixed'
		},
		inner: {
			position: 'relative'
		},
		closeButton: {
			position: 'absolute',
			top: -54,
			right: 0,
			minWidth: 54,
			width: 54,
			height: 54
		},
		wiContainer: {
			position: 'relative',
			width: `calc(100vw - ${2 * spacing(3)}px)`,
			height: `calc(100vw - ${2 * spacing(3)}px)`,
		},
		wi: {
			position: 'absolute',
			top: '50%',
			left: '50%',
			transform: 'translate(-50%, -50%)',
			zIndex: 1
		},
		wiDrop: {
			position: 'absolute',
			width: 120,
			height: 120,
			borderRadius: 120
		},
		temp: {
			fontSize: 50,
			lineHeight: '42px',
			fontWeight: 600
		},
		tempMin: {
			fontSize: 17,
			fontWeight: 600
		},
		tempMax: {
			marginLeft: spacing(2),
			color: palette.text.secondary,
			fontSize: 17,
			fontWeight: 600
		},
		icon: {
			marginBottom: spacing(1),
			color: palette.text.secondary
		},
		value: {
			fontWeight: 600
		}
	})
);

function Forecast() {

	const c = useStyles();

	// Set now to 00:00 to avoid float issues https://github.com/iamkun/dayjs/issues/1362
	const [now] = useState<Dayjs>(dayjs().hour(0));
	const [dates, setDates] = useState<Dayjs[][]>([]);
	const [settings, setSettings] = useState<Settings>({});
	const [forecast, setForecast] = useState<[]>([]);

	const datesRefs: RefObject<HTMLDivElement>[] = [];
	const detailsRefs: RefObject<HTMLDivElement>[] = [];
	const root = document.documentElement;
	const body = document.body;

	useEffect(() => {

		const currentDay = now.isoWeekday();
		const lastDay = now.add(14, 'day').isoWeekday();
		let parsedDates: Dayjs[] = [];

		// Add placeholder dates starting from the last Monday till now
		if (currentDay > 0) {
			for (let i = 1; i < now.isoWeekday(); i++) {
				parsedDates = [now.subtract(i, 'day'), ...parsedDates];
			}
		}

		// Add the next active 14 days for forecasting
		for (let i = 0; i < 14; i++) {
			parsedDates = [...parsedDates, now.add(i, 'day')];
		}

		// Add placeholder dates after the active 14 days ending at sunday
		if (lastDay > 1) {
			for (let i = 0; i < (8 - lastDay); i++) {
				parsedDates = [...parsedDates, now.add((14 + i), 'day')];
			}
		}

		const formattedDates: Dayjs[][] = [];

		// Chunk up the dates to provide chunks by week
		for (let i = 0; i < parsedDates.length; i += 7) {
			formattedDates.push(parsedDates.slice(i, i + 7));
		}

		setDates(formattedDates);

		setForecast(getForecast());
		setSettings(getSettings());

	}, []);

	const triggerAnimation: TriggerAnimation = (source, index, sourceType) => {
		const refs = sourceType === 'details' ? datesRefs : detailsRefs;
		const fromHero = (source && source.current) ? source.current : null;
		const toHero = (refs && refs.length && refs[index]) ? refs[index].current : null;

		if (fromHero && toHero) {
			animateHero(fromHero, toHero, sourceType === 'date');
		}
	};

	const animateHero = (fromHero: HTMLDivElement, toHero: HTMLDivElement, forward = true) => {

		const onComplete = () => {
			TweenLite.set(toHero, { visibility: 'visible' });
			if (forward) {
				TweenLite.fromTo(toHero.querySelector('.detailsInner'), 1.5,
					{ autoAlpha: 0 }, { autoAlpha: 1 });
			}
			body.removeChild(clone);
		};

		const clone = fromHero.cloneNode(true);

		const from = calculatePosition(fromHero);
		const to = calculatePosition(toHero);

		TweenLite.set([fromHero, toHero], { visibility: 'hidden' });
		TweenLite.set((clone as HTMLDivElement).querySelector('.detailsInner'), { visibility: 'hidden' });
		TweenLite.set(clone, { position: 'absolute', margin: 0 });

		body.appendChild(clone);

		const style = {
			x: to.left - from.left,
			y: to.top - from.top,
			width: to.width,
			height: to.height,
			padding: forward ? 24 : 0,
			autoRound: false,
			ease: Power1.easeOut,
			onComplete
		};

		TweenLite.set(clone, from);
		if (forward) {
			TweenLite.fromTo(clone, 0.5, { background: 'rgba(255,255,255,0)' }, { background: 'rgba(255,255,255,1)' });
		} else {
			TweenLite.fromTo(clone, 0.5, { background: 'rgba(255,255,255,1)' }, { background: 'rgba(255,255,255,0)' });
		}
		TweenLite.to(clone, 0.5, style);
	};

	const calculatePosition = (element: HTMLElement | HTMLDivElement) => {

		const rect = element.getBoundingClientRect();

		const scrollTop = window.pageYOffset || root.scrollTop || body.scrollTop || 0;
		const scrollLeft = window.pageXOffset || root.scrollLeft || body.scrollLeft || 0;

		const clientTop = root.clientTop || body.clientTop || 0;
		const clientLeft = root.clientLeft || body.clientLeft || 0;

		return {
			top: Math.round(rect.top + scrollTop - clientTop),
			left: Math.round(rect.left + scrollLeft - clientLeft),
			height: rect.height,
			width: rect.width
		};
	};

	calculatePosition(body);

	return (
		<div className={c.root}>
			<div className={c.container}>
				{dates.map((week, i) => (
					<div className={clsx(['tile', c.week])} key={i}>
						<div className={c.weekNumber}>{week[0].isoWeek()}</div>
						{week.map((date, j) => {
							const disabled = date.isBefore(now) || date.isAfter(now.add(13, 'days'));
							const newRef: RefObject<HTMLDivElement> = createRef();
							if (!disabled) {
								datesRefs.push(newRef);
							}
							const status = parseWeatherStatus(settings, forecast[j]);
							return (
								<Date
									{...(disabled ? {} : { ref: newRef })}
									date={date}
									disabled={disabled}
									status={status}
									key={date.unix()}
									onClick={(e) => disabled
										? e.preventDefault()
										: triggerAnimation(newRef, Math.round(date.diff(now, 'day', true)), 'date')}
								/>
							);
						})}
					</div>
				))}
			</div>
			<div className={c.detailsContainer}>
				{dates.map((week) => week.map((date, i) => {
					if (date.isBefore(now) || date.isAfter(now.add(13, 'days'))) {
						return null;
					}
					const ref: RefObject<HTMLDivElement> = createRef();
					detailsRefs.push(ref);
					const detailProps = { ref, date, forecast: forecast[i], settings, triggerAnimation };
					return <ForecastDetails key={date.unix()} {...detailProps} />;
				}))}
			</div>
		</div>

	);
}

export interface TriggerAnimation {
	(source: RefObject<HTMLDivElement>, index: number, sourceType: 'date' | 'details'): void
}

export default Forecast;
