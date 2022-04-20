import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRoomContext } from '../../../../RoomContext';
import { withStyles } from '@material-ui/core/styles';
import { useIntl, FormattedMessage } from 'react-intl';
import { permissions } from '../../../../permissions';
import { makePermissionSelector } from '../../../../store/selectors';
import Button from '@material-ui/core/Button';

const styles = (theme) =>
	({
		root :
		{
			display         : 'flex',
			padding         : theme.spacing(1),
			boxShadow       : '0 2px 5px 2px rgba(0, 0, 0, 0.2)',
			backgroundColor : 'rgba(255, 255, 255, 1)'
		},
		listheader :
		{
			padding    : theme.spacing(1),
			fontWeight : 'bolder'
		},
		actionButton :
		{
			marginLeft : 'auto'
		}
	});

const ChatHost = (props) =>
{
	const intl = useIntl();

	const {
		roomClient,
		isChatHost,
		isFileSharingHost,
		room,
		classes
	} = props;

	if (!isChatHost)
		return null;

	if (!isFileSharingHost)
		return null;

	const handleClearChat = () =>
	{
		roomClient.clearChat();
	};

	return (
		<ul className={classes.root}>
			<li className={classes.listheader}>
				<FormattedMessage
					id='room.Hostactions'
					defaultMessage='Host actions'
				/>
			</li>
			<Button
				aria-label={intl.formatMessage({
					id             : 'room.clearChat',
					defaultMessage : 'Clear chat'
				})}
				className={classes.actionButton}
				variant='contained'
				color='secondary'
				disabled={room.clearChatInProgress}
				onClick={handleClearChat}
			>
				<FormattedMessage
					id='room.clearChat'
					defaultMessage='Clear chat'
				/>
			</Button>
		</ul>
	);
};

ChatHost.propTypes =
{
	roomClient        : PropTypes.any.isRequired,
	isFileSharingHost : PropTypes.bool,
	isChatHost        : PropTypes.bool,
	room              : PropTypes.object,
	classes           : PropTypes.object.isRequired
};

const makeMapStateToProps = () =>
{
	const hasPermission = makePermissionSelector(permissions.MODERATE_CHAT);

	const mapStateToProps = (state) =>
		({
			isChatHost        : hasPermission(state),
			isFileSharingHost : hasPermission(state),
			room              : state.room
		});

	return mapStateToProps;
};

export default withRoomContext(connect(
	makeMapStateToProps,
	null,
	null,
	{
		areStatesEqual : (next, prev) =>
		{
			return (
				prev.room === next.room &&
				prev.me === next.me &&
				prev.peers === next.peers
			);
		}
	}
)(withStyles(styles)(ChatHost)));