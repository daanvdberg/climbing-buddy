import React, { createRef, RefObject, useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { TweenLite, Power1 } from 'gsap';
import Date, { Status } from '../../components/Date';
import clsx from 'clsx';

// @ts-ignore
const useStyles = makeStyles(({ spacing, palette, shadows }: Theme) =>
	createStyles({
		root: {},
		container: {
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
		},
		detailsContainer: {
			visibility: 'hidden'
		},
		details: {
			cursor: 'pointer',
			position: 'absolute',
			height: '100vh',
			width: '100vw',
			top: 0,
			left: 0,
			padding: spacing(3),
			backgroundColor: palette.background.paper,
			// @ts-ignore
			position: 'fixed'
		}
	})
);

function Forecast() {

	const c = useStyles();

	const [now] = useState<Dayjs>(dayjs());
	const [dates, setDates] = useState<Dayjs[][]>([]);

	const datesRefs: RefObject<HTMLDivElement>[] = [];
	const detailsRefs: RefObject<HTMLDivElement>[] = [];
	const root = document.documentElement;
	const body = document.body;

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

	const handleTriggerAnimation = (source: EventTarget, index: number, sourceType: 'date' | 'details') => {
		const refs = sourceType === 'details' ? datesRefs : detailsRefs;
		const target = (refs && refs.length && refs[index]) ? refs[index].current : null;
		
		console.log(source);
		console.log(refs);
		console.log(target);
		
		if (target && source) {
			animateHero(source as HTMLDivElement, target, sourceType === 'details' ? false : true);
		}
	}

	const animateHero = (fromHero: HTMLDivElement, toHero: HTMLDivElement, forward = true) => {

		const onComplete = () => {
			TweenLite.set(toHero, { visibility: 'visible' });
			body.removeChild(clone);
		}

		const clone = fromHero.cloneNode(true);

		const from = calculatePosition(fromHero);
		const to = calculatePosition(toHero);

		TweenLite.set([fromHero, toHero], { visibility: 'hidden' });
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
		TweenLite.to(clone, 0.3, style);
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
										: handleTriggerAnimation(e.target, date.diff(now, 'day'), 'date')
									}
								/>
							);
						})}
					</div>
				))}
			</div>
			<div className={c.detailsContainer}>
				{dates.map((week) => week.map((date) => {
					if (date.isBefore(now) || date.isAfter(now.add(13, 'days'))) {
						return null;
					}
					const newRef: RefObject<HTMLDivElement> = createRef();
					detailsRefs.push(newRef);
					return (
						<div
							ref={newRef}
							className={c.details}
							key={date.unix()}
							onClick={(e) =>
								handleTriggerAnimation(e.target, date.diff(now, 'day'), 'details')}
						>

							<Date date={date} status={Status.Average} key={date.unix()} />
						</div>
					);
				}))}
			</div>
		</div>

	);
}

export default Forecast;
