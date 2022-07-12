import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import axios from 'axios';
import { Menu, MenuItem } from '@material-ui/core';
import { environment } from '../../../environment';
import { withRoomContext } from '../../../RoomContext';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as appPropTypes from '../../appPropTypes';
import MessageAlert from './MessageAlert';

const useStyles = makeStyles((theme) =>
({
	root :
	{
		width           : '100%',
		backgroundColor : theme.palette.background.paper
	},
	nested :
	{
		paddingLeft : theme.spacing(4)
	}
}));

// const questionData = [ { question: 'My Video App Is best?', options: [ 'Yes', 'No', 'Other' ] } ];

const PollAnswerList = ({
	handleEditQuestion,
	handleLaunchQuestion,
	room,
	userData,
	singleQuestion,
	setSingleQuestion
}) =>
{
	const classes = useStyles();
	const [ open, setOpen ] = useState(true);
	const [ curentIndex, setCurentIndex ] = useState(0);
	const [ questionsList, setQuestionsList ] = useState([]);
	const [ anchorEl, setAnchorEl ] = useState(null);
	const [ messages, setMessages ] = useState(false);

	const myAxios = axios.create({
		baseURL : environment.baseUrl,
		headers : { 'Authorization': userData.token }
	});

	const handleClick = (index) =>
	{
		setOpen(true);
		setCurentIndex(index);
	};

	const GetQuestionList = async () =>
	{
		const userId = userData.userId;
		const meetingId = 1;
		const slug = room.roomId;

		await myAxios.post('/get_question', {
				'user_id'    : userId,
				'meeting_id' : meetingId,
				slug         : slug
			})
			.then((res) =>
			{
				console.log('res.data', res.data);

				if (res.status)
				{
					setQuestionsList(res.data.question);
				}
				console.log('res::', res);
			})
			.catch((error) => console.log('error', error));
	};

	const handleClickMore = (event, data) =>
	{
		setAnchorEl(event.currentTarget);
		setSingleQuestion(data);
		console.log('data ClickMore', data);
	};

	const handleClose = () =>
	{
		setAnchorEl(null);
	};

	const handleDeleteQuestion = async () =>
	{
		if (singleQuestion.id)
		{
			const id=singleQuestion.id;

			await myAxios.get(`/delete_question/${id}`).then((res) =>
			{
				if (res.status)
				{
					setMessages({ message: res.data.message, severity: 'success' });
					GetQuestionList();
					setSingleQuestion({});
					setTimeout(() =>
					{
						setMessages(false);
					}, 3000);
				}
			})
			.catch((error) => setMessages({ message: error.message, severity: 'error' }));
		}
		else
		{
			console.log('No have data');
		}
	};

	useEffect(() =>
	{
		GetQuestionList();
	}, []);

	return (
		<>
			{messages?<MessageAlert message={messages.message} severity={messages.severity} /> : ''}
			<List
				component='nav'
				aria-labelledby='nested-list-subheader'
				className={classes.root}
			>
				{questionsList && questionsList.length > 0 ? (
					questionsList.map((da, ind) =>
					{
						return (
							<>
								<ListItem button key={ind}>
									<ListItemIcon>{ind + 1}</ListItemIcon>
									<ListItemText primary={da.question} onClick={() => handleClick(ind)} />
									<MoreVertIcon onClick={(e) => handleClickMore(e, da)} />
									<Menu
										id='simple-menu'
										anchorEl={anchorEl}
										keepMounted
										open={Boolean(anchorEl)}
										onClose={handleClose}
									>
										<MenuItem onClick={() => handleLaunchQuestion()}>
											Launch Poll
										</MenuItem>
										<MenuItem onClick={() => handleEditQuestion()}>
											Edit{' '}
										</MenuItem>
										<MenuItem onClick={() => handleDeleteQuestion()}>
											Delete
										</MenuItem>
									</Menu>
								</ListItem>
								{curentIndex===ind?
									<Collapse in={open} timeout='auto' unmountOnExit>
										<List component='div' disablePadding>
											{da.options &&
												da.options.map((item, index) =>
												{
													return (
														<ListItem button className={classes.nested} key={index}>
															<ListItemIcon />
															<ListItemText primary={item.option} />
														</ListItem>
													);
												})}
										</List>
									</Collapse>
									: ''
								}
							</>
						);
					})
				) : (
					<div>No Data Found..</div>
				)}
			</List>
		</>
	);
};

PollAnswerList.propTypes =
{
	roomClient           : PropTypes.any.isRequired,
	classes              : PropTypes.object.isRequired,
	room                 : appPropTypes.Room.isRequired,
	userData             : PropTypes.object.isRequired,
	handleEditQuestion   : PropTypes.any.isRequired,
	handleLaunchQuestion : PropTypes.any.isRequired,
	singleQuestion       : PropTypes.object.isRequired,
	setSingleQuestion    : PropTypes.func.isRequired
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
				prev.room === next.room &&
				prev.settings.userData === next.settings.userData
			);
		}
	}
)(PollAnswerList));