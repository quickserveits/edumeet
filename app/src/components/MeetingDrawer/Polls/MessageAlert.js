import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) =>
({
	root :
	{
		width       : '100%',
		'& > * + *' :
		{
			marginTop : theme.spacing(2)
		}
	}
}));

export default function MessageAlert({ severity, message })
{
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<Alert variant='filled' severity={severity}>
				{ message }
			</Alert>
		</div>
  );
}
