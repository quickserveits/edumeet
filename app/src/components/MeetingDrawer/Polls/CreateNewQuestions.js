import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import axios from 'axios';
import PropTypes from 'prop-types';
import * as appPropTypes from '../../appPropTypes';
import { environment } from '../../../environment';
import { withRoomContext } from '../../../RoomContext';
import { connect } from 'react-redux';
import MessageAlert from './MessageAlert';

const useStyles = makeStyles((theme) => ({
	root :
	{
		display  : 'flex',
		flexWrap : 'wrap'
	},
	textField :
	{
		marginLeft  : theme.spacing(1),
		marginRight : theme.spacing(1),
		width       : '25ch'
	},
	textFieldFull :
	{
		marginLeft  : theme.spacing(1),
		marginRight : theme.spacing(1),
		width       : '100%'
	},
	container :
	{
		paddingTop : 20,
		textAlign  : 'left'
	}
}));

const CreateQuestions = ({ room, userData, singleQuestion }) =>
{
	const [ messages, setMessages ] = useState(false);
	const [ state, setState ] = useState({
		id       : '',
		question : '',
		option1  : '',
		option2  : '',
		option3  : '',
		option4  : ''
	});

	const classes = useStyles();

	const myAxios = axios.create({
		baseURL : environment.baseUrl,
		headers : { 'Authorization': userData.token }
	});

	const handleChange = (e) =>
	{
		const { name, value } = e.target;

		setState((pre) => ({ ...pre, [name]: value }));
	};

	const handleSubmit = async () =>
	{
		const userId = userData.userId;
		const meetingId = 1;
		const slug = room.roomId;

		let route = '/create_question';

		console.log('My State:: handleSubmit', state);

		if (state.id)
		{
			route = '/update_question';
		}
		await myAxios.post(route, {
				question        : state.question,
				'slug'         	: slug,
				questionId      : state.id,
				questionOptions : [
					state.option1,
					state.option2,
					state.option3,
					state.option4
				],
				'user_id'    : userId,
				'meeting_id' : meetingId
			})
			.then((res) =>
			{
				if (res.status===200)
				{
					setMessages({ message: res.data.message, severity: 'success' });
					setState({
						question : '',
						option1  : '',
						option2  : '',
						option3  : '',
						option4  : ''
					});
					setTimeout(() =>
					{
						setMessages(false);
					}, 3000);
				}
				else if (res.status===201)
				{
					setMessages({ message: res.data.message, severity: 'warning' });
					setTimeout(() =>
					{
						setMessages(false);
					}, 3000);
				}
			})
			.catch((error) => setMessages({ message: error.message, severity: 'error' }));
	};

useEffect(() =>
{
	if (singleQuestion.question)
	{
		const options=singleQuestion.options.sort((a, b) =>
		parseFloat(a.id) - parseFloat(b.id)
		);

		setState({
			id       : singleQuestion.id,
			question : singleQuestion.question,
			option1  : options[0].option,
			option2  : options[1].option,
			option3  : options[2].option,
			option4  : options[3].option
		});
	}
}, []);

console.log('My State::', state);

	return (
		<div className={classes.container}>
			{messages?<MessageAlert message={messages.message} severity={messages.severity} /> : ''}
			<TextField
				label='Question'
				id='outlined-margin-dense'
				placeholder='Please Enter Your Question'
				className={classes.textFieldFull}
				value={state.question}
				margin='dense'
				variant='outlined'
				name='question'
				onChange={(e) => handleChange(e)}
			/>
			<div>
				<TextField
					label='Option 1'
					id='outlined-margin-dense'
					placeholder='Please Enter Your Option 1'
					className={classes.textField}
					value={state.option1}
					margin='dense'
					variant='outlined'
					name='option1'
					onChange={(e) => handleChange(e)}
				/>
			</div>
			<div>
				<TextField
					label='Option 2'
					id='outlined-margin-dense'
					placeholder='Please Enter Your Option 2'
					className={classes.textField}
					value={state.option2}
					margin='dense'
					variant='outlined'
					name='option2'
					onChange={(e) => handleChange(e)}
				/>
			</div>
			<div>
				<TextField
					label='Option 3'
					id='outlined-margin-dense'
					placeholder='Please Enter Your Option 3'
					className={classes.textField}
					value={state.option3}
					margin='dense'
					variant='outlined'
					name='option3'
					onChange={(e) => handleChange(e)}
				/>
			</div>
			<div>
				<TextField
					label='Option 4'
					id='outlined-margin-dense'
					placeholder='Please Enter Your Option 4'
					className={classes.textField}
					value={state.option4}
					margin='dense'
					variant='outlined'
					name='option4'
					onChange={(e) => handleChange(e)}
				/>
			</div>
			<div style={{ marginTop: 20 }}>
				<center>
					<Button
						variant='contained'
						color='primary'
						onClick={() => handleSubmit()}
					>
						Submit
					</Button>
				</center>
			</div>
		</div>
	);
};

CreateQuestions.propTypes =
{
	roomClient     : PropTypes.any.isRequired,
	classes        : PropTypes.object.isRequired,
	room           : appPropTypes.Room.isRequired,
	userData       : PropTypes.object.isRequired,
	singleQuestion : PropTypes.object.isRequired
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
)(CreateQuestions));