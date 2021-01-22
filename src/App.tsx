import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Header from './components/Header';
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
		root: {}
	})
);

function App() {

	const c = useStyles();

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
