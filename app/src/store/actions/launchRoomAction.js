export const setlaunchPoll = (launchPoll) =>
	({
		type    : 'SET_OPEN_LAUNCH_POLL',
		payload : { launchPoll }
	});

export const setlaunchPollError = ({ data }) =>
({
	type    : 'SET_OPEN_LAUNCH_POLL_ERROR',
	payload : { data }
});