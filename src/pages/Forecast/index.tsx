import React, { useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Date, { Status } from '../../components/Date';

const useStyles = makeStyles(({ spacing, palette }: Theme) =>
	createStyles({
		root: {
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
		}
	})
);

function Forecast() {

	const c = useStyles();

	const [now] = useState<Dayjs>(dayjs());
	const [dates, setDates] = useState<Dayjs[][]>([]);

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

	}, []);

	return (
		<div className={c.root}>
			{dates.map((week, i) => (
				<div className={c.week} key={i}>
					<div className={c.weekNumber}>{week[0].isoWeek()}</div>
					{week.map((date) => {
						const disabled = date.isBefore(now) || date.isAfter(now.add(13, 'days'));
						return <Date date={date} disabled={disabled} status={Status.Average} key={date.unix()} />;
					})}
				</div>
			))}
		</div>
	);
}

export default Forecast;
