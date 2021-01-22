import '@material-ui/core/styles';

declare module '@material-ui/core/styles/createPalette' {
	interface Palette {
		status: {
			0: string
			1: string
			2: string
		}
	}
	interface PaletteOptions {
		status: {
			0: string
			1: string
			2: string
		}
	}
}