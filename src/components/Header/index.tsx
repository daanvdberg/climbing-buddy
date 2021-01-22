import React from 'react';
import { createUseStyles, useTheme } from 'react-jss';
import { Link, useLocation } from 'react-router-dom';
import { Theme } from '../../theme';
import Icon from '../Icon';


const useStyles = createUseStyles<Theme>((theme) => ({
	header: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: 40,
		padding: [[12, 15, 14]],
		borderBottomLeftRadius: 20,
		borderBottomRightRadius: 20,
		background: theme.palette.secondary.main
	},
	left: {
		flex: [[0, 0, `${40}px`]]
	},
	right: {
		flex: [[0, 0, `${40}px`]]
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
		color: theme.palette.common.white
	},
	subTitle: {
		fontWeight: 800
	}
}));

function Header() {

	const location = useLocation();
	
	console.log(location.pathname);

	const theme = useTheme<Theme>();
	const c = useStyles();

	return (
		<header className={c.header}>
			<div className={c.left}>
				<Link to='/settings' className={c.button}>
					<Icon fill={theme.palette.common.white} name='settings' />
				</Link>
			</div>
			<Link to='/' className={c.title}>
				<Icon scale='s' fill={theme.palette.common.white} name='climbing' />
				<div>CLIMBING<span className={c.subTitle}>BUDDY</span></div>
			</Link>
			<div className={c.right}>
				{location.pathname !== '/' &&
					<Link to='/' className={c.button}>
						<Icon fill={theme.palette.common.white} name='close' />
					</Link>
				}
			</div>
		</header>
	);
}

export default Header;