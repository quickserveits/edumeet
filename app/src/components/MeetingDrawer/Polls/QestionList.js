import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { withRoomContext } from '../../../RoomContext';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

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

 function QestionList({
	handleAnswer,
	questionsList,
	singleAnswer
})
{
	const classes = useStyles();
	const [ open, setOpen ] = useState(true);
	const [ curentIndex, setCurentIndex ] = useState(0);

	const handleClick = (index) =>
	{
		setOpen(true);
		setCurentIndex(curentIndex !==0?0: '');
	};

	return (
		<>
			{questionsList && questionsList.length > 0 ? (
				questionsList.map((da, ind) =>
				{
					return (
						<>
							<ListItem button onClick={() => handleClick(ind)} key={ind}>
								<ListItemIcon>
									<InboxIcon />
								</ListItemIcon>
								<ListItemText primary={da.question} />
								{open ? <ExpandLess /> : <ExpandMore />}
							</ListItem>
							{curentIndex===ind?
								<Collapse in={open} timeout='auto' unmountOnExit>
									<List component='div' disablePadding>
										{da.options &&
											da.options.map((item, index) =>
											{
												const isAnswer=singleAnswer.find((findData) =>
												findData.option_id === item.id);

												return (
													<ListItem
														button
														className={classes.nested}
														key={index}
														onClick={() => handleAnswer(item)}
													>
														<ListItemIcon>
															{isAnswer?<CheckCircleIcon /> : ''}
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
		</>
	);
}

QestionList.propTypes =
{
	questionsList : PropTypes.arrayOf.isRequired,
	handleAnswer  : PropTypes.func.isRequired,
	singleAnswer  : PropTypes.arrayOf.isRequired
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
)(QestionList));