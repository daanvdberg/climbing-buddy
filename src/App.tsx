import React, { useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { createUseStyles } from 'react-jss';
import { Theme } from './theme';

const useStyles = createUseStyles<Theme>((theme) => ({
	'@global': {
		html: {
			margin: 0,
			padding: 0,
			fontFamily: '\'Montserrat\', -apple-system, BlinkMacSystemFont, \'Segoe UI\', \'Roboto\', \'Oxygen\', \'Ubuntu\', \'Cantarell\', \'Fira Sans\', \'Droid Sans\', \'Helvetica Neue\', sans-serif',
			'-webkit-font-smoothing': 'antialiased',
			'-moz-osx-font-smoothing': 'grayscale'
		},
		body: {
			margin: 0,
			padding: 0,
			fontSize: '0.875rem',
			lineHeight: 1.43,
			letterSpacing: '0.01071em'
		}
	},
	root: {
		backgroundColor: theme.palette.background.primary,
		color: theme.palette.text.primary
	},
	weekNumber: {
		padding: [[5, 10]],
		backgroundColor: theme.palette.primary.main,
		fontSize: 24,
		fontWeight: 800,
		color: theme.palette.common.white
	},
	row: {
		padding: 20,
		display: 'flex'
	},
	header: {
		display: 'flex',
		width: 100,
		flexDirection: 'column'
	},
	body: {
		flex: 1
	},
	weekDay: {
		fontSize: 40
	},
	date: {
		fontSize: 14,
		fontWeight: 600
	}
}));

function App() {

	const c = useStyles();

	const [dates, setDates] = useState<Dayjs[]>([]);

	useEffect(() => {
		let now = dayjs().add(5, 'day');
		setDates([now]);

		for (let i = 1; i < 11; i++) {
			setDates((oldDates) => [...oldDates, now.add(i, 'day')]);
		}

	}, []);

	console.log(dates);

	return (
		<div className={c.root}>
			{dates.length && dates.map((e, i) => {

				if (i === 0 || e.week() !== dates[i - 1].week()) {
					return <div className={c.weekNumber} key={i}>W{e.week()}</div>;
				}

				return (
					<div className={c.row} key={i}>
						<header className={c.header}>
							<div className={c.weekDay}>{e.format('dddd')[0]}</div>
							<div className={c.date}>{e.format('Do')}</div>
						</header>
						<section className={c.body}>BODY</section>
					</div>
				);
			})}
		</div>
	);
}

export default App;
