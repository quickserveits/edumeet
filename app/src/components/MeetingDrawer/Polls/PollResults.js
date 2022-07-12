import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import axios from 'axios';
import { environment } from '../../../environment';
import { withRoomContext } from '../../../RoomContext';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as appPropTypes from '../../appPropTypes';

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

 function PollResults({ userData, room })
{
	const classes = useStyles();
	const [ open, setOpen ] = React.useState(false);
	const [ curentIndex, setCurentIndex ] = React.useState(0);
	const [ questionsList, setQuestionsList ] = React.useState([]);

	const myAxios = axios.create({
		baseURL : environment.baseUrl,
		headers : { 'Authorization': userData.token }
	});

	const handleClick = (index) =>
	{
		setOpen(!open);
		setCurentIndex(index);
	};

	const GetQuestionList = async () =>
	{
		const userId = userData.userId;
		const meetingId = 1;
		const slug = room.roomId;

		await myAxios
			.post('/get_answer', {
				'user_id'    : userId,
				'meeting_id' : meetingId,
				slug         : slug
			})
			.then((res) =>
			{
				if (res.status)
				{
					console.log('res.data', res.data);
					const table = [];

					res.data.question.map((da) =>
					{
						const optionList = [];

						da.answers.forEach((item) =>
						{
							if (item)
							{
								const index = optionList.indexOf((daa) =>
								daa.option_id === item.options.id);

								if (index>-1)
								{
									optionList[index].count += 1;
								}
								else
								{
									optionList.push({
										count       : 1,
										'option_id' : item.option_id,
										option      : item.options.option
									});
								}
							}
						});

						table.push({
							question : da.question,
							slug     : da.slug,
							options  : optionList
						});
					});
					setQuestionsList(table);
				}
			})
			.catch((error) => console.log('error', error));
	};

	useEffect(() =>
	{
		GetQuestionList();
	}, []);

	console.log('questionsList::', questionsList);

	return (
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
							<ListItem button onClick={() => handleClick(ind)} key={ind}>
								<ListItemIcon />
								<ListItemText primary={da.question} />
								{open ? <ExpandLess /> : <ExpandMore />}
							</ListItem>
							{curentIndex===ind?
								<Collapse in={open} timeout='auto' unmountOnExit>
									<List component='div' disablePadding>
										{da.options &&
											da.options.map((item, index) =>
											{
												return (
													<ListItem button className={classes.nested} key={index}>
														<ListItemIcon>
															{item.count} %
														</ListItemIcon>
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
	);
}

PollResults.propTypes =
{
	room                 : appPropTypes.Room.isRequired,
	userData             : PropTypes.object.isRequired,
	handleEditQuestion   : PropTypes.any.isRequired,
	handleLaunchQuestion : PropTypes.any.isRequired
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
)(PollResults));