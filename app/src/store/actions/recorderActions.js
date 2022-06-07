export const setLocalRecordingState = (status) =>
	({
		type    : 'SET_LOCAL_RECORDING_STATE',
		payload : { status }
	});
export const setLocalRecordingConsent = (agreed) =>
	({
		type    : 'SET_LOCAL_RECORDING_CONSENT',
		payload : { agreed }
	});
export const setCloudRecordingState = (status) =>
	({
		type    : 'SET_CLOUD_RECORDING_STATE',
		payload : { status }
	});
export const setCloudRecordingConsent = (agreed) =>
	({
		type    : 'SET_CLOUD_RECORDING_CONSENT',
		payload : { agreed }
	});
