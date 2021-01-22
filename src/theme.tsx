const theme = {
	palette: {
		common: {
			black: '#000',
			white: '#fff'
		},
		primary: {
			light: '#fcb28d',
			main: '#fd8a4e',
			dark: '#e55d19'
		},
		secondary: {
			light: '#57314b',
			main: '#57314b',
			dark: '#57314b'
		},
		text: {
			primary: '#434F6C',
			secondary: '#969CAC',
			disabled: '#caced9'
		},
		background: {
			primary: '#e9e9e9',
			light: '#fff'
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