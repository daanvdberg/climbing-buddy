const theme = {
	palette: {
		common: {
			black: '#000',
			white: '#fff'
		},
		primary: {
			light: '#4F919A',
			main: '#4F919A',
			dark: '#4F919A'
		},
		text: {
			primary: '#434F6C',
			secondary: '#969CAC',
			disabled: '#BEC6D8'
		},
		background: {
			primary: '#E9E9E9'
		}
	},
	typography: {
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
			fontSize: 14
		},
	}
}

export type Theme = typeof theme;

export default theme;