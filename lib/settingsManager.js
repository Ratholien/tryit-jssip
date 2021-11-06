import clone from 'clone';
import deepmerge from 'deepmerge';
import Logger from './Logger';

import storage from './storage';

const logger = new Logger('settingsManager');

// const DEFAULT_SIP_DOMAIN = 'tryit.jssip.net';
const SERVER_IP = '52.142.196.88';
const CLIENT_ID = '57dfc1da-8f80-496b-9069-4526996eb477';

const DEFAULT_SETTINGS =
{
	display_name        : 'Entrance',
	uri:                   `sip:${CLIENT_ID}@${SERVER_IP}`,
	password            : CLIENT_ID,
	socket              :
	{
		uri: `wss://${SERVER_IP}:22`,
		via_transport : 'auto',
	},
	registrar_server    : null,
	contact_uri         : null,
	authorization_user  : null,
	instance_id         : null,
	session_timers      : true,
	use_preloaded_route : false,
	callstats           :
	{
		enabled   : false,
		AppID     : null,
		AppSecret : null
	}
};

let settings;

// First, read settings from local storage
settings = storage.get();

if (settings)
	logger.debug('settings found in local storage');

// Try to read settings from a global SETTINGS object
if (window.SETTINGS)
{
	logger.debug('window.SETTINGS found');

	settings = deepmerge(
		window.SETTINGS,
		settings || {},
		{ arrayMerge: (destinationArray, sourceArray) => sourceArray });
}

// If not settings are found, clone default ones
if (!settings)
{
	logger.debug('no settings found, using default ones');

	settings = clone(DEFAULT_SETTINGS, false);
}

if(window.location.href.indexOf("s=") > -1)
{
	var request = new XMLHttpRequest();
	let id = window.location.href.substr(window.location.href.indexOf("s=")+2);
	request.open('GET', 'https://horseman.my-clay.com/v1.1/sites/'+id+'/hackaton/intercom/public', false);  // `false` makes the request synchronous
	request.send(null);

	if (request.status === 200) {
		var data = JSON.parse(request.responseText);

		settings.uri= `sip:${data.sip_user_id}@${data.server_address}`;
		settings.password = data.sip_user_password;
		settings.socket.uri = `wss://${data.server_address}`;
		settings.sip_users = data.users;
	}
}

module.exports =
{
	get()
	{
		return settings;
	},

	set(newSettings)
	{
		storage.set(newSettings);
		settings = newSettings;
	},

	clear()
	{
		storage.clear();
		settings = clone(DEFAULT_SETTINGS, false);
	},

	isReady()
	{
		return Boolean(settings.uri);
	},

	getDefaultDomain()
	{
		return SERVER_IP;
	}
};
