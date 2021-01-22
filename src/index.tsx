import React from 'react';
import ReactDOM from 'react-dom';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/isoWeek';
import jss from 'jss';
import { ThemeProvider } from 'react-jss';
import globalPlugin from 'jss-plugin-global';
import composePlugin from 'jss-plugin-compose';
import App from './App';
import reportWebVitals from './reportWebVitals';
import theme from './theme';

dayjs().format();
dayjs.extend(weekOfYear);

jss.use(globalPlugin());
jss.use(composePlugin());

ReactDOM.render(
	<React.StrictMode>
		<ThemeProvider theme={theme}>
			<App />
		</ThemeProvider>
	</React.StrictMode>,
	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
