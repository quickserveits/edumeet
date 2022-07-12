import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as appPropTypes from '../../appPropTypes';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import QestionList from './QestionList';
import axios from 'axios';
import { environment } from '../../../environment';
import { connect } from 'react-redux';
import { withRoomContext } from '../../../RoomContext';
import { ListItemText, makeStyles } from '@material-ui/core';
import Close from '@material-ui/icons/Close';
import MessageAlert from './MessageAlert';

const useStyles = makeStyles((theme) => ({
	root :
	{
		marginLeft : 10,
		minWidth   : 320,
		boxShadow  : '0px 0px 1px 4px #ececec',
		position   : 'absolute',
		bottom     : 10,
		zIndex     : 99999,
		background : 'white'
	},
	closeButton :
	{
		cursor : 'pointer'
	}
}));

function LaunchPoll({ launchRoom, userData, room, roomClient })
{
	const [ messages, setMessages ] = useState(false);
	const [ singleAnswer, setSingleAnswer ] = useState([]);
	const { questions, adminId } = launchRoom;
	const classes = useStyles();

	const myAxios = axios.create({
		baseURL : environment.baseUrl,
		headers : { 'Authorization': userData.token }
	});

	const handleGetAnswer = async () =>
	{
		await myAxios.post('/get_single_answer', {
			'slug'        : room.roomId,
			'question_id' : questions[0].id,
			'user_id'     : userData.userId
		})
		.then((res) =>
		{
			if (res.status===200)
			{
				setSingleAnswer(res.data.singleAnswer);
				setTimeout(() =>
				{
					setMessages(false);
				}, 3000);
			}
		})
		.catch((error) => setMessages({ message: error.message, severity: 'error' }));
	};

	const handleAnswer = async (data) =>
	{
		console.log('handleAnswer::', data);

		await myAxios.post('/create_answer', {
			'slug'        : room.roomId,
			'question_id' : data.question_id,
			'option_id'   : data.id,
			'user_id'     : userData.userId,
			'meeting_id'  : 1
		})
		.then((res) =>
		{
			if (res.status===200)
			{
				setMessages({ message: res.data.message, severity: 'success' });
				handleGetAnswer();
				setTimeout(() =>
				{
					setMessages(false);
				}, 3000);
			}
		})
		.catch((error) => setMessages({ message: error.message, severity: 'error' }));
	};

	const handleLaunchQuestion = () =>
	{
		roomClient.setHandlePollLaunch({
			roomId     : room.roomId,
            questions  : [],
            adminId    : userData.userId,
            launchOpen : false
			});
	};

	useEffect(() =>
	{
		handleGetAnswer();
	}, []);

	const isClose = userData.userId===adminId? true : false;

  return (
	<>
		<List
			component='nav'
			aria-labelledby='nested-list-subheader'
			className={classes.root}
		>
			<ListItem>
				<ListItemText primary={'Answer Poll'} />
				{isClose ?
					<Close
						className={classes.closeButton}
						onClick={() => handleLaunchQuestion()}
					/> :''}
			</ListItem>
			{messages?<MessageAlert message={messages.message} severity={messages.severity} /> : ''}
			<QestionList
				handleAnswer={handleAnswer}
				questionsList={questions}
				singleAnswer={singleAnswer}
			/>
		</List>
	</>
  );
}

LaunchPoll.propTypes =
{
	roomClient    : PropTypes.any.isRequired,
	room          : appPropTypes.Room.isRequired,
	launchRoom    : appPropTypes.Room.isRequired,
	userData      : PropTypes.object.isRequired,
	questionsList : PropTypes.arrayOf.isRequired,
	handleAnswer  : PropTypes.func.isRequired
};

const mapStateToProps = (state) =>
	({
		room       : state.room,
		launchRoom : state.launchRoom,
		userData   : state.settings.userData
	});

export default withRoomContext(connect(
	mapStateToProps,
	{
		areStatesEqual : (next, prev) =>
		{
			return (
				prev.room === next.room &&
				prev.launchRoom === next.launchRoom &&
				prev.settings.userData === next.settings.userData
			);
		}
	}
)(LaunchPoll));