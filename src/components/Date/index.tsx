import { Dayjs } from 'dayjs';
import React from 'react';
import { createStyles, makeStyles, Theme, useTheme, emphasize, darken, fade } from '@material-ui/core/styles';

interface StyleProps {
	statusColor?: string
	disabled?: boolean
}

const useStyles = makeStyles(({ palette }: Theme) =>
	createStyles({
		date: {
			justifySelf: 'center',
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
		disabledDate: {
			composes: '$date',
			pointerEvents: 'none',
			border: `1px solid ${palette.text.disabled}`,
			color: palette.text.disabled,
			backgroundColor: '#fafafa'
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
	})
);

export enum Status { Bad, Average, Good}

function Date({ date, status, disabled }: Props) {

	const theme = useTheme();
	const statusColor = (typeof status !== 'undefined' && status in Status) ? theme.palette.status[status] : 'transparent';
	const c = useStyles({ statusColor, disabled });

	return (
		<div className={disabled ? c.disabledDate : c.date}>
			<div className={c.weekDay}>{date.locale('en').format('ddd')}</div>
			<div className={c.day}>{date.format('D')}</div>
		</div>
	);
}

interface Props {
	date: Dayjs
	status?: Status
	disabled: boolean
}

export default Date;