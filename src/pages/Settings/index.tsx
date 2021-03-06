import React, { useEffect, useState } from 'react';
import {
	Box,
	Button,
	Checkbox,
	FormControlLabel,
	FormGroup,
	Grid,
	Slider,
	Typography
} from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { getSettings, Settings as ISettings, updateSettings } from '../../database';

const useStyles = makeStyles(({ palette, spacing }: Theme) =>
	createStyles({
		loading: {
			position: 'fixed',
			top: '40vh',
			right: 0,
			bottom: '40vh',
			left: 0,
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center'
		},
		root: {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'space-between',
			padding: 20
		},
		form: {},
		formControlLabel: {
			flexGrow: 1,
			justifyContent: 'space-between',
			marginLeft: 0
		},
		slider: {
			padding: spacing(0, 1.75, 0, 2.25)
		},
		footer: {
			position: 'absolute',
			right: 0,
			bottom: 0,
			left: 0,
			padding: spacing(2, 3),
			textAlign: 'center',
			fontSize: 12,
			color: palette.text.secondary
		}
	})
);

const windMarks = [
	{ value: 0, label: '0' },
	{ value: 6, label: '6' },
	{ value: 12, label: '12' }
];

const marks = [
	{
		value: -10,
		label: '-10°C'
	},
	{
		value: 0,
		label: '0°C'
	},
	{
		value: 15,
		label: '15°C'
	},
	{
		value: 40,
		label: '40°C'
	}
];

function valuetext(value: number) {
	return `${value}°C`;
}

function Settings() {

	const c = useStyles();

	const [rain, setRain] = useState<boolean>(false);
	const [temperature, setTemperature] = useState<number[]>([10, 30]);
	const [wind, setWind] = useState<ISettings['wind']>(4);

	useEffect(() => {
		refreshSettings();
	}, []);

	const refreshSettings = () => {
		const settings = getSettings();
		const { rain = false, temperature: { min = 10, max = 30 } = {}, wind = 4 } = settings;
		setRain(rain);
		setTemperature([min, max]);
		setWind(wind);
	}

	const handleToggleRain = () => setRain((val) => !val);

	const handleChangeTemperature = (event: any, newValue: number | number[]) => setTemperature(newValue as number[]);
	
	const handleChangeWind = (event: any, newValue: number | number[]) => setWind(newValue as number);
	
	const handleSubmit = () => {
		const originalSettings = getSettings();
		updateSettings({
			...originalSettings,
			rain,
			temperature: {
				min: temperature[0],
				max: temperature[1]
			},
			wind
		});
		refreshSettings();
	}

	return (
		<div className={c.root}>

			<Box mb={2}><Typography variant='h2' gutterBottom>Settings</Typography></Box>

			<form className={c.form} noValidate>
				<Grid container spacing={2}>
					<Grid item xs={12} sm={6}>
						<Typography variant='caption'>Precipitation</Typography>
						<FormGroup row>
							<FormControlLabel
								value='rain'
								control={<Checkbox color='primary' checked={rain} onChange={handleToggleRain} />}
								label='Rain won&apos;t stop me'
								labelPlacement='start'
								className={c.formControlLabel}
							/>
						</FormGroup>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Typography id='temp-slider' gutterBottom variant='caption'>
							Temperature
						</Typography>
						<div className={c.slider}>
							<Slider
								value={temperature}
								onChange={handleChangeTemperature}
								defaultValue={15}
								getAriaValueText={valuetext}
								aria-labelledby='temp-slider'
								step={2}
								marks={marks}
								valueLabelDisplay='auto'
								min={-10}
								max={40}
							/>
						</div>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Typography id='wind-slider' gutterBottom variant='caption'>
							Maximum Wind Speed
						</Typography>
						<div className={c.slider}>
							<Slider
								value={wind}
								onChange={handleChangeWind}
								defaultValue={4}
								aria-labelledby='wind-slider'
								step={1}
								marks={windMarks}
								valueLabelDisplay='auto'
								min={0}
								max={12}
								track={false}
							/>
						</div>
					</Grid>
					<Grid item xs={12}>
						<Button
							fullWidth
							variant='contained'
							color='primary'
							size='large'
							onClick={handleSubmit}
						>
							Apply Settings
						</Button>
					</Grid>
				</Grid>
			</form>

			<div className={c.footer}>
				<p>Weather data provided by weatherbit.io</p>
				<p>Icons are courtesy of Nook Fulloption, Gregor Cresnar & Mark Roberts (via the Noun Project).</p>
			</div>

		</div>
	);
}

export default Settings;