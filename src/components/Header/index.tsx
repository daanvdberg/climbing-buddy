import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import Icon from '../Icon';

const useStyles = makeStyles(({ spacing, palette }: Theme) =>
	createStyles({
		header: {
			boxSizing: 'content-box',
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center',
			height: 40,
			padding: spacing(1.5, 1.75, 1.5),
			borderBottomLeftRadius: 20,
			borderBottomRightRadius: 20,
			background: palette.secondary.main
		},
		left: {
			flex: '0 0 40px'
		},
		right: {
			flex: '0 0 40px'
		},
		button: {
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			width: 40,
			height: 40
		},
		title: {
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center',
			fontSize: 18,
			fontWeight: 400,
			color: palette.common.white
		},
		subTitle: {
			fontWeight: 800
		}
	})
);

function Header() {

	const location = useLocation();

	const { palette } = useTheme<Theme>();
	const c = useStyles();

	return (
		<header className={c.header}>
			<div className={c.left}>
				<Link to='/settings' className={c.button}>
					<Icon fill={palette.common.white} name='settings' />
				</Link>
			</div>
			<Link to='/' className={c.title}>
				<Icon scale='s' fill={palette.common.white} name='climbing' />
				<div>CLIMBING<span className={c.subTitle}>BUDDY</span></div>
			</Link>
			<div className={c.right}>
				{location.pathname !== '/' &&
					<Link to='/' className={c.button}>
						<Icon fill={palette.common.white} name='close' />
					</Link>
				}
			</div>
		</header>
	);
}

export default Header;