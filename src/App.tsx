import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Header from './components/Header';
import { getSettings, setForecast } from './database';
import Forecast from './pages/Forecast';
import Settings from './pages/Settings';

const useStyles = makeStyles(({ palette }: Theme) =>
	createStyles({
		'@global': {
			html: {
				margin: 0,
				padding: 0,
				height: '100%'
			},
			body: {
				margin: 0,
				padding: 0,
				fontSize: '0.875rem',
				lineHeight: 1.43,
				letterSpacing: '0.01071em',
				background: 'none'
			},
			a: {
				color: 'inherit',
				textDecoration: 'none'
			}
		},
		loading: {
			position: 'fixed',
			top: 0,
			right: 0,
			bottom: 0,
			left: 0,
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			backgroundColor: palette.secondary.main
		},
		root: {
			minHeight: '100vh'
		}
	})
);

function App() {

	const c = useStyles();

	const [loading, setLoading] = useState(true);

	const { REACT_APP_WEATHER_URL: URL, REACT_APP_WEATHER_KEY: KEY } = process.env;
	const settings = getSettings();
	const { latitude, longitude } = settings.location;

	useEffect(() => {
		fetch(`${URL}?key=${KEY}&days=14&lat=${latitude}&lon=${longitude}`)
			.then((res) => res.json())
			.then((res) => {
				setForecast(res.data);
				setTimeout(() => setLoading(false), 1000);
			});
	}, []);

	if (loading) {
		return (
			<div className={c.loading}>
				<CircularProgress />
			</div>
		);
	}

	return (
		<div className={c.root}>

			<Router>

				<Header />

				<Routes>
					<Route path='/' element={<Forecast />} />
					<Route path='/settings' element={<Settings />} />
				</Routes>

			</Router>

		</div>
	);
}

export default App;
