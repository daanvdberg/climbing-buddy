import { IconName } from '@fortawesome/fontawesome-svg-core';
import { Palette, PaletteColor } from '@material-ui/core/styles/createPalette';
import React, { createRef, RefObject, useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { Box, Button, Grid, Typography } from '@material-ui/core';
import { createStyles, fade, makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import { TweenLite, Power1 } from 'gsap';
import clsx from 'clsx';
import Date, { Status } from '../../components/Date';
import Icon from '../../components/Icon';
import { getForecast, getSettings, Settings } from '../../database';
import { msToBeaufort } from '../../utilities';

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

const parseWeatherStatus = (settings: Settings, forecast: { [key: string]: any }): Status => {
	const { temp } = forecast;
	return Status.Average;
}

// TODO: Separate component
const getWeatherStyle = (theme: Theme, code: number) => {
	let icon: IconName;
	let color: Palette['weatherColor'];
	switch (code) {
		case 200: case 201: case 202: case 230: case 231: case 232: case 233:
			icon = 'thunderstorm';
			color = theme.palette.weatherColor[0];
			break;

		case 500: case 501: case 511: case 520: case 900:
			icon = 'cloud-showers';
			color = theme.palette.weatherColor[3];
			break;

		case 502: case 522:
			icon = 'cloud-showers-heavy';
			color = theme.palette.weatherColor[4];
			break;

		case 600: case 601: case 602: case 610: case 621: case 622: case 623:
			icon = 'cloud-snow';
			color = theme.palette.weatherColor[5];
			break;

		case 801: case 802:
			icon = 'cloud-sun';
			color = theme.palette.weatherColor[1];
			break;

		case 803: case 804:
			icon = 'clouds';
			color = theme.palette.weatherColor[2];
			break;

		case 800:
		default:
			icon = 'sun';
			color = theme.palette.weatherColor[0];
	}
	return { color, icon };
}

function Forecast() {

	const theme = useTheme();
	const c = useStyles();

	const [now] = useState<Dayjs>(dayjs());
	const [dates, setDates] = useState<Dayjs[][]>([]);
	const [settings, setSettings] = useState<Settings>({ location: {} });
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

		const onComplete = () => {
			TweenLite.set(toHero, { visibility: 'visible' });
			if (forward) {
				TweenLite.fromTo(toHero.querySelector('.detailsInner'), 2,
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
					//console.log(fc);
					const style = getWeatherStyle(theme, fc.weather.code);
					// Positioning calculations for the colored circle behind the weather icon
					const rx = Math.floor((window.innerWidth - 48) * 0.5);
					const ry = Math.floor((window.innerWidth - 48) * 0.5);
					const ra = 30 + (Math.random() * 20);
					const pxr = Math.random();
					const pyr = Math.random();
					const wiPositioning = {
						...(pxr < 0.5 ? { left: (rx + ra) + 'px' } : { right: (rx + ra) + 'px' }),
						...(pyr < 0.5 ? { top: (ry + ra) + 'px' } : { bottom: (ry + ra) + 'px' }),
						transform: `translate(${pxr < 0.5 ? '-50%' : '50%'}, ${pyr < 0.5 ? '-50%' : '50%'})`
					};
					const status = parseWeatherStatus(settings, fc);
					return (
						<div ref={newRef} className={c.details} key={date.unix()}>
							<Date date={date} status={status} key={date.unix()} />

							<div className={clsx(['detailsInner', c.inner])}>
								<Button
									onClick={() =>
										handleTriggerAnimation(newRef, date.diff(now, 'day'), 'details')}
									className={c.closeButton}
								>
									<Icon icon='times' size='lg' />
								</Button>
								<div>
									<Box textAlign='center' pt={2}>
										<Typography variant='subtitle1'><b>{settings.location.location}</b></Typography>
										<Typography variant='subtitle2'>{fc.weather.description}</Typography>
									</Box>
									<Box className={c.wiContainer}>
										<Icon className={c.wi} icon={style.icon} size='9x' />
										<Box
											className={c.wiDrop}
											bgcolor={style.color}
											style={{
												...wiPositioning
											}}
										/>
									</Box>
									<Grid container justify='space-between' alignItems='flex-end'>
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
									<Box mt={6}>
										<Grid container>
											<Grid item xs={4}>
												<Box display='flex' flexDirection='column' alignItems='center'>
													<Icon icon='wind' size='lg' className={c.icon} />
													<Box className={c.value}>{msToBeaufort(fc.wind_spd)}</Box>
												</Box>
											</Grid>
											<Grid item xs={4}>
												<Box display='flex' flexDirection='column' alignItems='center'>
													<Icon icon='humidity' size='lg' className={c.icon} />
													<Box className={c.value}>{fc.rh}%</Box>
												</Box>
											</Grid>
											<Grid item xs={4}>
												<Box display='flex' flexDirection='column' alignItems='center'>
													<Icon icon='umbrella' size='lg' className={c.icon} />
													<Box className={c.value}>{fc.pop}%</Box>
												</Box>
											</Grid>
										</Grid>
									</Box>
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
