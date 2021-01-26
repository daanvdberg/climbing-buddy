import React, { createRef, RefObject, useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { TweenLite, Power1 } from 'gsap';
import Date, { Status } from '../../components/Date';
import clsx from 'clsx';
import { Box, Button, Grid, Typography } from '@material-ui/core';
import Icon from '../../components/Icon';
import { getForecast, getSettings } from '../../database';

// @ts-ignore
const useStyles = makeStyles(({ spacing, palette }: Theme) =>
	createStyles({
		root: {},
		container: {
			display: 'grid',
			gridTemplateColumns: '1fr 1fr 1fr',
			gridGap: 14,
			padding: spacing(2, 4),
			color: palette.text.primary
		},
		week: {
			display: 'grid',
			gridGap: 14,
			'&:nth-child(1) $weekNumber': {
				color: palette.secondary.main
			}
		},
		weekNumber: {
			textAlign: 'center',
			fontSize: 18,
			fontWeight: 800,
			color: palette.secondary.light
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
		temp: {
			fontSize: 40,
			fontWeight: 600
		},
		tempMin: {
			fontSize: 20,
			fontWeight: 600
		},
		tempMax: {
			marginLeft: 10,
			color: palette.text.secondary,
			fontSize: 20,
			fontWeight: 600
		}
	})
);

function Forecast() {

	const c = useStyles();

	const [now] = useState<Dayjs>(dayjs());
	const [dates, setDates] = useState<Dayjs[][]>([]);
	const [location, setLocation] = useState<string>();
	const [forecast, setForecast] = useState<[]>([]);

	const datesRefs: RefObject<HTMLDivElement>[] = [];
	const detailsRefs: RefObject<HTMLDivElement>[] = [];
	const root = document.documentElement;
	const body = document.body;

	useEffect(() => {
		const currentDay = now.weekday();
		const lastDay = now.add(14, 'day').day();
		let parsedDates: Dayjs[] = [];

		// Add placeholder dates starting from the last Monday till now
		if (currentDay > 0) {
			for (let i = 1; i < now.day(); i++) {
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

		const settings = getSettings();
		setLocation(settings.location.location);

	}, []);

	const handleTriggerAnimation = (
		source: RefObject<HTMLDivElement>,
		index: number,
		sourceType: 'date' | 'details'
	) => {
		const refs = sourceType === 'details' ? datesRefs : detailsRefs;
		const fromHero = (source && source.current) ? source.current : null;
		const toHero = (refs && refs.length && refs[index]) ? refs[index].current : null;

		if (fromHero && toHero) {
			animateHero(fromHero, toHero, sourceType === 'date');
		}
	};

	const animateHero = (fromHero: HTMLDivElement, toHero: HTMLDivElement, forward = true) => {

		console.log(forward);

		const onStart = () => {
			if (!forward) {
				TweenLite.to(toHero.querySelector('.detailsInner'), 0.7, { visibility: 'visible' });
			}
		};

		const onComplete = () => {
			TweenLite.set(toHero, { visibility: 'visible' });
			body.removeChild(clone);
		};

		const clone = fromHero.cloneNode(true);

		const from = calculatePosition(fromHero);
		const to = calculatePosition(toHero);

		TweenLite.set([fromHero, toHero], { visibility: 'hidden' });
		TweenLite.set(clone, { position: 'absolute', margin: 0 });

		body.appendChild(clone);

		if (!forward) {
			TweenLite.set((clone as HTMLDivElement).querySelector('.detailsInner'), { visibility: 'hidden' });
		}

		const style = {
			x: to.left - from.left,
			y: to.top - from.top,
			width: to.width,
			height: to.height,
			padding: forward ? 24 : 0,
			autoRound: false,
			ease: Power1.easeOut,
			onComplete,
			onStart
		};

		TweenLite.set(clone, from);
		if (forward) {
			TweenLite.fromTo(clone, 0.7, { background: 'rgba(255,255,255,0)' }, { background: 'rgba(255,255,255,1)' });
		} else {
			TweenLite.fromTo(clone, 0.7, { background: 'rgba(255,255,255,1)' }, { background: 'rgba(255,255,255,0)' });
		}
		TweenLite.to(clone, 0.7, style);
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
							return (
								<Date
									{...(disabled ? {} : { ref: newRef })}
									date={date}
									disabled={disabled}
									status={Status.Average}
									key={date.unix()}
									onClick={(e) => disabled
										? e.preventDefault()
										: handleTriggerAnimation(newRef, date.diff(now, 'day'), 'date')
									}
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
					const newRef: RefObject<HTMLDivElement> = createRef();
					detailsRefs.push(newRef);
					const fc: { [key: string]: any } = forecast[i];
					console.log(fc);
					return (
						<div ref={newRef} className={c.details} key={date.unix()}>
							<Date date={date} status={Status.Average} key={date.unix()} />

							<div className={clsx(['detailsInner', c.inner])}>
								<Button
									onClick={() =>
										handleTriggerAnimation(newRef, date.diff(now, 'day'), 'details')}
									className={c.closeButton}
								>
									<Icon name='close' />
								</Button>
								<div>
									<Box textAlign='center' mb={2}>
										<Typography variant='subtitle1'><b>{location}</b></Typography>
										<Typography variant='subtitle2'>{fc.weather.description}</Typography>
									</Box>

									<Box mb={40} />
									<Grid container justify='space-between' alignItems='center'>
										<Grid item>
											<Box className={c.temp}>{fc.temp}°C</Box>
										</Grid>
										<Grid item>
											<Grid container alignItems='center'>
												<Box className={c.tempMin}>{fc.app_max_temp}°C</Box>
												<Box className={c.tempMax}>{fc.app_min_temp}°C</Box>
											</Grid>
										</Grid>
									</Grid>
								</div>
							</div>
						</div>
					);
				}))}
			</div>
		</div>

	);
}

export default Forecast;
