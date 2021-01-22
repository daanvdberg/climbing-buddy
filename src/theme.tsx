import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
	palette: {
		common: {
			black: '#000',
			white: '#fff'
		},
		primary: {
			light: '#fab593',
			main: '#fd8a4e',
			dark: '#cb5114',
			contrastText: '#57314b'
		},
		secondary: {
			light: '#8d7686',
			main: '#57314b',
			dark: '#3e1230'
		},
		text: {
			primary: '#434F6C',
			secondary: '#969CAC',
			disabled: '#caced9'
		},
		background: {
			default: '#e9e9e9'
		},
		status: {
			0: '#f18e5b',
			1: '#e8b94A',
			2: '#4fac94'
		}
	},
	typography: {
		fontFamily: [
			'Montserrat',
			'-apple-system',
			'BlinkMacSystemFont',
			'"Segoe UI"',
			'Roboto',
			'"Helvetica Neue"',
			'Arial',
			'sans-serif',
			'"Apple Color Emoji"',
			'"Segoe UI Emoji"',
			'"Segoe UI Symbol"',
		].join(','),
		h1: {
			fontSize: 32
		},
		h2: {
			fontSize: 28
		},
		h3: {
			fontSize: 24
		},
		h4: {
			fontSize: 22
		},
		h5: {
			fontSize: 20
		},
		h6: {
			fontSize: 18
		},
		body1: {
			fontSize: 16
		},
		body2: {
			fontSize: 14
		},
		button: {
			fontSize: 14,
			fontWeight: 600
		}
	}
});

export default theme;