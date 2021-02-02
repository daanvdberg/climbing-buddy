import { IconName } from '@fortawesome/fontawesome-svg-core';
import { Box, Button, Grid, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import { Palette } from '@material-ui/core/styles/createPalette';
import clsx from 'clsx';
import dayjs, { Dayjs } from 'dayjs';
import React, { forwardRef, Ref, RefObject } from 'react';
import { Settings } from '../../database';
import { TriggerAnimation } from '../../pages/Forecast';
import { msToBeaufort, parseWeatherStatus, randomizeCircularPosition } from '../../utilities';
import Date, { Status } from '../Date';
import Icon from '../Icon';


const useStyles = makeStyles(({ spacing, palette }: Theme) =>
	createStyles({
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

const ForecastDetails = forwardRef<HTMLDivElement, Props>(({
	                                                           date,
	                                                           forecast,
	                                                           settings,
	                                                           triggerAnimation
                                                           }, ref: Ref<HTMLDivElement>) => {

	const c = useStyles();
	const theme = useTheme();

	// Set now to 00:00 to avoid float issues https://github.com/iamkun/dayjs/issues/1362
	const now = dayjs().hour(0);

	// Positioning calculations for the colored circle behind the weather icon
	const wiPositioning = randomizeCircularPosition();
	const style = getWeatherStyle(theme, forecast.weather.code);
	const status = parseWeatherStatus(settings, forecast);

	if (!ref) {
		return null;
	}
	
	console.log(forecast);
	
	return (
		<div ref={ref} className={c.details}>

			<Date date={date} status={status} />

			<div className={clsx(['detailsInner', c.inner])}>
				<Button
					onClick={() =>
						triggerAnimation(
							ref as RefObject<HTMLDivElement>,
							Math.round(date.diff(now, 'day', true)),
							'details'
						)}
					className={c.closeButton}
				>
					<Icon icon='times' size='lg' />
				</Button>
				<div>
					<Box textAlign='center' pt={2}>
						<Typography variant='subtitle1'><b>{settings.location?.location}</b></Typography>
						<Typography variant='subtitle2'>{forecast.weather.description}</Typography>
					</Box>
					<Box className={c.wiContainer}>
						<Icon className={c.wi} icon={style.icon} size='9x' />
						<Box className={c.wiDrop} bgcolor={style.color} style={wiPositioning} />
					</Box>
					<Grid container justify='space-between' alignItems='flex-end'>
						<Grid item>
							<Box className={c.temp}>{forecast.temp}°C</Box>
						</Grid>
						<Grid item>
							<Grid container alignItems='center'>
								<Box className={c.tempMin}>{forecast.app_max_temp}°C</Box>
								<Box className={c.tempMax}>{forecast.app_min_temp}°C</Box>
							</Grid>
						</Grid>
					</Grid>
					<Box mt={6}>
						<Grid container>
							<Grid item xs={4}>
								<Box display='flex' flexDirection='column' alignItems='center'>
									<Icon icon='wind' size='lg' className={c.icon} />
									<Box className={c.value}>{msToBeaufort(forecast.wind_spd)}</Box>
								</Box>
							</Grid>
							<Grid item xs={4}>
								<Box display='flex' flexDirection='column' alignItems='center'>
									<Icon icon='humidity' size='lg' className={c.icon} />
									<Box className={c.value}>{forecast.rh}%</Box>
								</Box>
							</Grid>
							<Grid item xs={4}>
								<Box display='flex' flexDirection='column' alignItems='center'>
									<Icon icon='umbrella' size='lg' className={c.icon} />
									<Box className={c.value}>{forecast.pop}%</Box>
								</Box>
							</Grid>
						</Grid>
					</Box>
				</div>
			</div>
		</div>
	);
});

interface Props {
	date: Dayjs
	forecast: { [key: string]: any }
	settings: Settings
	triggerAnimation: TriggerAnimation
}

export default ForecastDetails;