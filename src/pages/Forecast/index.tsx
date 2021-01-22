import React, { useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { createUseStyles } from 'react-jss';
import { Theme } from '../../theme';

const useStyles = createUseStyles<Theme>((theme) => ({
	root: {
		display: 'grid',
		gridTemplateColumns: '1fr 1fr 1fr',
		gridGap: 14,
		padding: [[15, 30]],
		color: theme.palette.text.primary
	},
	week: {
		display: 'grid',
		gridGap: 14
	},
	weekNumber: {
		textAlign: 'center',
		fontSize: 18,
		fontWeight: 800,
		color: theme.palette.secondary.light
	},
	date: {
		justifySelf: 'center',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		width: 54,
		height: 54,
		border: `1px solid ${theme.palette.text.primary}`,
		borderRadius: 8,
		color: theme.palette.text.primary
	},
	disabledDate: {
		composes: '$date',
		pointerEvents: 'none',
		border: `1px solid ${theme.palette.text.disabled}`,
		color: theme.palette.text.disabled
	},
	weekDay: {
		fontSize: 13,
		fontWeight: 400
	},
	day: {
		fontSize: 21,
		fontWeight: 600,
		lineHeight: 1.18
	}
}));

function Forecast() {

	const c = useStyles();

	const [now] = useState<Dayjs>(dayjs());
	const [dates, setDates] = useState<Dayjs[][]>([]);

	useEffect(() => {
		const currentDay = now.isoWeekday();
		const lastDay = now.add(14, 'day').day();
		let parsedDates: Dayjs[] = [];

		// Add placeholder dates starting from a previous Monday till now
		if (currentDay > 1) {
			for (let i = 1; i < now.day(); i++) {
				parsedDates = [now.subtract(i, 'day'), ...parsedDates];
			}
		}
		// Additional loop due to Dayjs treating Sunday as day 0
		if (currentDay === 0) {
			for (let i = 1; i < 7; i++) {
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
		// Additional statement due to Dayjs treating Sunday as day 0
		if (lastDay === 0) {
			parsedDates = [...parsedDates, now.add(14, 'day')];
		}

		const formattedDates: Dayjs[][] = [];

		for (let i = 0; i < parsedDates.length; i += 7) {
			formattedDates.push(parsedDates.slice(i, i + 7));
		}

		console.log(formattedDates);

		console.log(dayjs('2021-01-01').isoWeekday());

		setDates(formattedDates);

	}, []);

	return (
		<div className={c.root}>
			{dates.map((week) => (
				<div className={c.week}>
					<div className={c.weekNumber}>{week[0].isoWeek()}</div>
					{week.map((e, i) => {
						const disabled = e.isBefore(now) || e.isAfter(now.add(13, 'days'));
						return (
							<div className={disabled ? c.disabledDate : c.date} key={i}>
								<div className={c.weekDay}>{e.format('ddd')}</div>
								<div className={c.day}>{e.format('D')}</div>
							</div>
						)
					})}
				</div>
			))}
		</div>
	);
}

export default Forecast;
