/* eslint linebreak-style: ["error", "windows"]*/
import React, { useRef } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { withRoomContext } from '../RoomContext';
import * as roomActions from '../store/actions/roomActions';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import CancelIcon from '@material-ui/icons/Cancel';

const styles = (theme) =>
	({
		dialogPaper :
		{
			width                          : '30vw',
			[theme.breakpoints.down('lg')] :
			{
				width : '40vw'
			},
			[theme.breakpoints.down('md')] :
			{
				width : '50vw'
			},
			[theme.breakpoints.down('sm')] :
			{
				width : '70vw'
			},
			[theme.breakpoints.down('xs')] :
			{
				width : '90vw'
			}
		},
		dialogActions :
		{
			flexDirection                  : 'row',
			[theme.breakpoints.down('xs')] :
			{
				flexDirection : 'column'
			}
		},

		logo :
		{
			marginLeft  : theme.spacing(1.5),
			marginRight : 'auto'
		},
		divider :
		{
			marginBottom : theme.spacing(3)
		}
	});

const HelpeDialog = ({
	messageOpen,
	classes,
	handleSetCloseOpen
}) =>

{
	const buttonYes = useRef();

	const handleEnterKey = (event) =>
	{
		if (event.key === 'Enter')
		{
			buttonYes.current.click();
		}
		else
		if (event.key === 'Escape' || event.key === 'Esc')
		{
			handleSetCloseOpen(false);
		}
	};

	const handleStay = () => handleSetCloseOpen(false);

	return (
		<Dialog
			onKeyDown={handleEnterKey}
			open={messageOpen}
			onClose={() => handleSetCloseOpen(false)}
			classes={{
				paper : classes.dialogPaper
			}}
		>
			<DialogTitle id='form-dialog-title' dividers>
				<FormattedMessage
					id='room.leavingTheRoom'
					defaultMessage='Are you sure you dont want audio or video?'
				/>
			</DialogTitle>
			<DialogContent dividers>
				<FormattedMessage
					id='room.leaveConfirmationMessage'
					defaultMessage='If you changeYour mind, select the camera icon by your address bar and then Always allow'
				/>
			</DialogContent>
			<DialogActions className={classes.dialogActions}>
				<Button
					onClick={() => handleStay()}
					color='primary'
					startIcon={<CancelIcon />}
				>
					<FormattedMessage
						id='label.no'
						defaultMessage='Ok'
					/>
				</Button>
			</DialogActions>
		</Dialog>
	);
};

HelpeDialog.propTypes =
{
	roomClient         : PropTypes.object.isRequired,
	messageOpen        : PropTypes.bool.isRequired,
	handleSetCloseOpen : PropTypes.func.isRequired,
	classes            : PropTypes.object.isRequired,
	chatCount          : PropTypes.number.isRequired
};

const mapStateToProps = (state) =>
	({
		messageOpen : state.room.messageOpen,
		chatCount   : state.chat.count
	});

const mapDispatchToProps = {
	handleSetCloseOpen : roomActions.setCloseOpen
};

export default withRoomContext(connect(
	mapStateToProps,
	mapDispatchToProps,
	null,
	{
		areStatesEqual : (next, prev) =>
		{
			return (
				prev.room.messageOpen === next.room.messageOpen &&
				prev.chat.count === next.chat.count
			);
		}
	}
)(withStyles(styles)(HelpeDialog)));
