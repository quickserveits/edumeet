import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import Close from '@material-ui/icons/Close';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import { useLocation } from 'react-router-dom';
import { ShareSocial } from 'react-share-social';
import { withRoomContext } from '../../../RoomContext';
import { Button } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import {
	EmailShareButton,
	WhatsappShareButton,
	EmailIcon,
	WhatsappIcon
  } from 'react-share';

const styles = (theme) =>
	({
		root :
		{
			display              : 'flex',
			width                : '100%',
			height               : '100%',
			backgroundAttachment : 'fixed',
			backgroundPosition   : 'center',
			backgroundSize       : 'cover',
			backgroundRepeat     : 'no-repeat'
		},
		dialogTitle :
		{
			backgroundColor : 'rgb(35 31 68)'
		},
		dialogPaper :
		{
			width                          : '30vw',
			padding                        : theme.spacing(2),
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
				width  : '90vw',
				margin : 0
			}
		},
		accountButton :
		{
			padding : 0
		},
		accountButtonAvatar :
		{
			width                         : 50,
			height                        : 50,
			[theme.breakpoints.down(400)] :
			{
				width  : 35,
				height : 35
			}

		},

		green :
		{
			color : 'rgba(0, 153, 0, 1)'
		},
		red :
		{
			color : 'rgba(153, 0, 0, 1)'
		},
		joinButton :
		{
			[theme.breakpoints.down(600)] :
			{
				'width' : '100%'
			}

		},
		mediaDevicesAnySelectedButton :
		{
			'& .Mui-selected' : {
				color           : 'white',
				backgroundColor : 'rgba(0, 0, 0, 0.87)',
				'&:hover'       : {
					color           : 'white',
					backgroundColor : 'rgba(0, 0, 0, 0.87)'
				} }

		}

	});

const shareLink=
{
    borderRadius : 3,
    border       : 0,
    color        : 'white',
    padding      : '0 30px'
};

const DialogContent = withStyles((theme) => ({
	root :
	{
		padding    : theme.spacing(2),
		paddingTop : theme.spacing(0)
	}
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
	root :
	{
		margin  : 0,
		padding : theme.spacing(1)
	}
}))(MuiDialogActions);

const ShareDialogs = ({
    classes
}) =>
{
	const [ open, setOpen ]=useState(false);

	const location = useLocation();

	return (
		<div className={classes.root}>
			<Button
				variant='contained'
				onClick={() => setOpen(true)}
			>
				Invite
			</Button>
			<Dialog
				onClose={() => setOpen(false)}
				open={open}
				classes={{
					paper : classes.dialogPaper
				}}
			>
				<DialogContent>
					<WhatsappShareButton
						url={`https://meeting.ejtimaa.com${location.pathname}`}
					>
						<WhatsappIcon size={32} round />
					</WhatsappShareButton>
					<EmailShareButton
						url={`https://meeting.ejtimaa.com${location.pathname}`}
					>
						<EmailIcon size={32} round />
					</EmailShareButton>
					<ShareSocial
						style={shareLink}
						url={`https://meeting.ejtimaa.com${location.pathname}`}
						socialTypes={[ '' ]}
					/>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => setOpen(false)} color='primary'
						startIcon={<Close />}
					>
						<FormattedMessage
							id='label.close'
							defaultMessage='Close'
						/>
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

ShareDialogs.propTypes =
{
	roomClient : PropTypes.any.isRequired,
	classes    : PropTypes.object.isRequired
};

export default withRoomContext(connect(
	null,
	{
		areStatesEqual : (next, prev) =>
		{
			return (
				prev.room.inLobby === next.room.inLobby
			);
		}
	}
)(withStyles(styles)(ShareDialogs)));
