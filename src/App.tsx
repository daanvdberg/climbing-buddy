import React from 'react';
import { createUseStyles } from 'react-jss';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Forecast from './pages/Forecast';
import Settings from './pages/Settings';
import { Theme } from './theme';


const useStyles = createUseStyles<Theme>((theme) => ({
	'@global': {
		html: {
			margin: 0,
			padding: 0,
			fontFamily: '\'Montserrat\', -apple-system, BlinkMacSystemFont, \'Segoe UI\', \'Roboto\', \'Oxygen\', \'Ubuntu\', \'Cantarell\', \'Fira Sans\', \'Droid Sans\', \'Helvetica Neue\', sans-serif',
			'-webkit-font-smoothing': 'antialiased',
			'-moz-osx-font-smoothing': 'grayscale',
			backgroundColor: theme.palette.background.light,
		},
		body: {
			margin: 0,
			padding: 0,
			fontSize: '0.875rem',
			lineHeight: 1.43,
			letterSpacing: '0.01071em'
		},
		a: {
			color: 'inherit',
			textDecoration: 'none'
		}
	},
	root: {}
}));

function App() {

	const c = useStyles();

	return (
		<div className={c.root}>

			<Router>

				<Header />

				<Routes>
					<Route path="/" element={<Forecast />} />
					<Route path="/settings" element={<Settings />} />
				</Routes>

			</Router>

		</div>
	);
}

export default App;
