import React from 'react';
import PropTypes from 'prop-types';
import Select from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import classnames from 'classnames';
import Logger from '../Logger';
import utils from '../utils';
import UserChip from './UserChip';

const logger = new Logger('Dialer');

const Placeholder = ({ children }) => {

	return <div>{children}</div>;
};
export default class Dialer extends React.Component {
	constructor(props) {
		super(props);

		this.state =
		{
			uri: props.callme || ''
		};
	}

	render() {
		const state = this.state;
		const props = this.props;
		const settings = props.settings;
		const selectedClient = null;

		return (
			<div data-component='Dialer'>
				<div className='userchip-container'>
					<UserChip
						name={settings.display_name}
						uri={settings.uri || ''}
						status={props.status}
						fullWidth
					/>
				</div>

				<form
					className={classnames('uri-form', { hidden: props.busy && utils.isMobile() })}
					action=''
					onSubmit={this.handleSubmit.bind(this)}
				>

					<div className='uri-container'>
						<If condition={settings.sip_users != null}>
							<select
								value={state.uri}
								onChange={this.handleUriChange.bind(this)}
								fullWidth
								disabled={!this._canCall()}
							>
								<option value="" selected>Select who you want to call</option>
								{settings.sip_users.map((option) => (
									<option value={option.sip_id}>{option.name}</option>
								))}
							</select>
						</If>

						<If condition={settings.sip_users == null}>
							<TextField
								hintText='SIP URI or username'
								fullWidth
								disabled={!this._canCall()}
								value={state.uri}
								onChange={this.handleUriChange.bind(this)}
							/>
						</If>
					</div>


					<RaisedButton
						label='Call'
						primary
						disabled={!this._canCall() || !state.uri}
						onClick={this.handleClickCall.bind(this)}
					/>

				</form>
			</div>
		);
	}

	handleUriChange(event) {
		console.log("UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU");
		console.log(this.selectedClient);
		console.log("kjhvbkgkhbgkugukygb");
		console.log(event.target.value);
		console.log("kjhvbkgkhbgkugukygb");
		this.setState({ uri: event.target.value });
	}

	handleSubmit(event) {
		logger.debug('handleSubmit()');

		event.preventDefault();

		if (!this._canCall() || !this.state.uri)
			return;

		this._doCall();
	}

	handleClickCall() {
		console.log(item);
		logger.debug('handleClickCall()');

		this._doCall(item);
	}

	_doCall() {
		const uri = this.state.uri;

		logger.debug('_doCall() [uri:"%s"]', uri);

		this.setState({ uri: '' });
		this.props.onCall(uri);
	}

	_canCall() {
		const props = this.props;

		return (
			!props.busy &&
			(props.status === 'connected' || props.status === 'registered')
		);
	}
}

Dialer.propTypes =
{
	settings: PropTypes.object.isRequired,
	status: PropTypes.string.isRequired,
	busy: PropTypes.bool.isRequired,
	callme: PropTypes.string,
	onCall: PropTypes.func.isRequired
};
