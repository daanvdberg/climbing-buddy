import React from 'react';
import ReactDOM from 'react-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/nl';
import weekday from 'dayjs/plugin/weekday';
import isoWeek from 'dayjs/plugin/isoWeek';
import { CssBaseline,  } from '@material-ui/core';
import { ThemeProvider, StylesProvider, jssPreset } from '@material-ui/core/styles';
import { create } from 'jss';
import compose from 'jss-plugin-compose';
import App from './App';
import theme from './theme';

dayjs().format();
dayjs.locale('nl');
dayjs.extend(weekday);
dayjs.extend(isoWeek);

// Add support for JSS Compose: https://cssinjs.org/jss-plugin-compose
const jss = create({
	plugins: [...jssPreset().plugins, compose()],
});

ReactDOM.render(
	<React.StrictMode>
		<StylesProvider jss={jss}>
			<ThemeProvider theme={theme}>
				<CssBaseline>
					<App />
				</CssBaseline>
			</ThemeProvider>
		</StylesProvider>
	</React.StrictMode>,
	document.getElementById('root')
);
