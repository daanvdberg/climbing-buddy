import { Dayjs } from 'dayjs';
import React, { ComponentPropsWithoutRef, forwardRef } from 'react';
import { createStyles, makeStyles, Theme, useTheme, darken, fade } from '@material-ui/core/styles';

interface StyleProps {
	statusColor?: string
	disabled?: boolean
}

const useStyles = makeStyles(({ palette }: Theme) =>
	createStyles({
		dateContainer: {
			position: 'relative',
			justifySelf: 'center',
			width: 54,
			height: 54
		},
		disabledDate: {
			composes: '$dateContainer',
			pointerEvents: 'none',
			'& > $date': {
				border: `1px solid ${palette.text.disabled}`,
				color: palette.text.disabled,
				backgroundColor: '#fafafa'
			}
		},
		date: {
			pointerEvents: 'none',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			width: 54,
			height: 54,
			backgroundColor: ({ statusColor }: StyleProps) =>
				statusColor ? fade(statusColor, 0.3) : 'transparent',
			borderRadius: 8,
			color: ({ statusColor }: StyleProps) =>
				statusColor ? darken(statusColor, 0.4) : palette.text.primary
		},
		weekDay: {
			pointerEvents: 'none',
			fontSize: 13,
			fontWeight: 400
		},
		day: {
			pointerEvents: 'none',
			fontSize: 21,
			fontWeight: 600,
			lineHeight: 1.18
		}
	})
);

export enum Status { Bad, Average, Good}

const Date = forwardRef<HTMLDivElement, Props>(({
	                                                date,
	                                                status,
	                                                disabled,
	                                                ...rest
                                                }, ref) => {

	const theme = useTheme();
	const statusColor = (typeof status !== 'undefined' && status in Status) ? theme.palette.status[status] : 'transparent';
	const c = useStyles({ statusColor, disabled });
	
	return (
		<div ref={ref} className={disabled ? c.disabledDate : c.dateContainer} {...rest}>
			<div className={c.date}>
				<div className={c.weekDay}>{date.locale('en').format('ddd')}</div>
				<div className={c.day}>{date.format('D')}</div>
			</div>
		</div>
	);
});

interface Props extends ComponentPropsWithoutRef<'div'> {
	date: Dayjs
	status?: Status
	disabled?: boolean
}

export default Date;