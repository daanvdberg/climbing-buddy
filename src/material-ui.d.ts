import '@material-ui/core/styles';

declare module '@material-ui/core/styles/createPalette' {
	interface Palette {
		weatherColor: {
			[key: number]: string
		}
		status: {
			0: string
			1: string
			2: string
		}
	}
	interface PaletteOptions {
		weatherColor: {
			[key: number]: string
		}
		status: {
			0: string
			1: string
			2: string
		}
	}
}