import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import * as appPropTypes from '../../appPropTypes';
import Dialog from '@material-ui/core/Dialog';
import Close from '@material-ui/icons/Close';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import { withRoomContext } from '../../../RoomContext';
import { Box, Button, Tab, Tabs, Typography, useTheme } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import CreateQuestions from './CreateNewQuestions';
import PollAnswerList from './PollAnswerList';
import PollResults from './PollResults';

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
		// backgroundColor : 'rgb(35 31 68)',
		display        : 'flex',
		justifyContent : 'space-between',
		alignItems     : 'center'
	},
	dialogPaper :
	{
		width                          : '70vw',
		padding                        : theme.spacing(2),
		[theme.breakpoints.down('lg')] :
		{
			width : '70vw'
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
		'& .Mui-selected' :
		{
			color           : 'white',
			backgroundColor : 'rgba(0, 0, 0, 0.87)',
			'&:hover'       :
			{
				color           : 'white',
				backgroundColor : 'rgba(0, 0, 0, 0.87)'
			}
		}
	}
});

function TabPanel(props)
{
	const { children, value, index, ...other } = props;

	return (
		<div
			role='tabpanel'
			hidden={value !== index}
			id={`full-width-tabpanel-${index}`}
			aria-labelledby={`full-width-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box p={3}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

TabPanel.propTypes =
{
	children : PropTypes.node,
	index    : PropTypes.any.isRequired,
	value    : PropTypes.any.isRequired
};

function a11yProps(index)
{
	return {
		id              : `full-width-tab-${index}`,
		'aria-controls' : `full-width-tabpanel-${index}`
	};
}

const DialogContent = withStyles((theme) =>
({
	root :
	{
		padding    : theme.spacing(2),
		paddingTop : theme.spacing(0)
	}
}))(MuiDialogContent);

const DialogActions = withStyles((theme) =>
({
	root :
	{
		margin  : 0,
		padding : theme.spacing(1)
	}
}))(MuiDialogActions);

const MyPolls = ({
	classes,
	room,
	userData,
	roomClient
}) =>
{
	const [ open, setOpen ] = useState(false);
	const [ value, setValue ] = React.useState(0);
	const [ singleQuestion, setSingleQuestion ] = React.useState({});
	const theme = useTheme();

	const handleChange = (event, newValue) =>
	{
		setValue(newValue);
		setSingleQuestion({});
	};

	const handleEditQuestion = () =>
	{
		setValue(0);
	};

	const handleLaunchQuestion = () =>
	{
		roomClient.setHandlePollLaunch({
			roomId     : room.roomId,
            questions  : [ singleQuestion ],
            adminId    : userData.userId,
            launchOpen : true
			});
		setOpen(false);
	};

	return (
		<div className={classes.root}>
			<Button
				variant='contained'
				onClick={() => setOpen(true)}
			>
				Polls
			</Button>
			<Dialog
				// onClose={() => setOpen(false)}
				open={open}
				classes={{
					paper : classes.dialogPaper
				}}
			>
				<DialogContent>
					<Tabs
						value={value}
						onChange={handleChange}
						indicatorColor='primary'
						textColor='primary'
						variant='fullWidth'
						aria-label='full width tabs example'
					>
						<Tab label='Create New Questions' {...a11yProps(0)} />
						<Tab label='Questions List' {...a11yProps(1)} />
						<Tab label='Answer List' {...a11yProps(2)} />
					</Tabs>

					<TabPanel value={value} index={0} dir={theme.direction}>
						<CreateQuestions
							singleQuestion={singleQuestion}
							userData={userData}
						/>
					</TabPanel>
					<TabPanel value={value} index={1} dir={theme.direction}>
						<PollAnswerList
							handleEditQuestion={handleEditQuestion}
							handleLaunchQuestion={handleLaunchQuestion}
							singleQuestion={singleQuestion}
							setSingleQuestion={setSingleQuestion}
							userData={userData}
						/>
					</TabPanel>
					<TabPanel value={value} index={2} dir={theme.direction}>
						<PollResults room={room} userData={userData} />
					</TabPanel>
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

MyPolls.propTypes =
{
	roomClient : PropTypes.any.isRequired,
	classes    : PropTypes.object.isRequired,
	room       : appPropTypes.Room.isRequired,
	userData   : PropTypes.object.isRequired
};

const mapStateToProps = (state) =>
	({
		room     : state.room,
		userData : state.settings.userData
	});

export default withRoomContext(connect(
	mapStateToProps,
	{
		areStatesEqual : (next, prev) =>
		{
			return (
				prev.room === next.room&&
				prev.settings.userData === next.settings.userData
			);
		}
	}
)(withStyles(styles)(MyPolls)));
