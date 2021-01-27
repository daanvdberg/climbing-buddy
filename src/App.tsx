import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Header from './components/Header';
import { setForecast } from './database';
import Forecast from './pages/Forecast';
import Settings from './pages/Settings';
import { CircularProgress } from '@material-ui/core';

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
		root: {},
		footer: {
			visibility: 'hidden'
		}
	})
);

function App() {

	const c = useStyles();

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch(`${process.env.REACT_APP_WEATHER_URL}?key=${process.env.REACT_APP_WEATHER_KEY}&days=14&city=Vleuten&country=NL`)
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
		)
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

			<div className={c.footer}>
				Icons are courtesy of Nook Fulloption, Gregor Cresnar & Mark Roberts (by the Noun Project).
			</div>

		</div>
	);
}

export default App;
