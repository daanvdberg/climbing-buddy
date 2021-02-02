import low from 'lowdb';
import LocalStorage from 'lowdb/adapters/LocalStorage'

const adapter = new LocalStorage('db');
const db = low(adapter);

interface Settings {
	location?: {
		longitude: number,
		latitude: number,
		location: string,
		country: string
	},
	rain?: boolean,
	temperature?: {
		min: number,
		max: number
	},
	wind?: number
}

db.defaults({
	settings: {
		location: {
			longitude: '5.0241',
			latitude: '52.1093',
			location: 'Vleuten',
			country: 'NL'
		},
		rain: false,
		temperature: {
			min: 10,
			max: 30
		},
		wind: 4
	},
	forecast: []
}).write();

const updateSettings = (settings: Settings) => db.set('settings', settings).write();

const getSettings = () => db.get('settings').value();

const setForecast = (forecast: []) => db.set('forecast', forecast).write();

const getForecast = () => db.get('forecast').value();

export type {
	Settings
}

export {
	updateSettings,
	getSettings,
	setForecast,
	getForecast
}