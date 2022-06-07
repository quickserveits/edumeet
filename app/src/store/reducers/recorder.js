const initialState = {
	localRecordingState : {
		status  : 'init',
		consent : 'init'
	},
	cloudRecordingState : {
		status  : 'init',
		consent : 'init'
	}
}

;

const recorder = (state = initialState, action) =>
{
	switch (action.type)
	{
		case 'SET_LOCAL_RECORDING_STATE':
		{
			const { status } = action.payload;

			const localRecordingState = state['localRecordingState'];

			localRecordingState.status = status;

			return { ...state,
				localRecordingState : localRecordingState
			};
		}

		case 'SET_LOCAL_RECORDING_CONSENT':
		{
			const { agreed } = action.payload;
			const localRecordingState = state['localRecordingState'];

			localRecordingState.consent = agreed;

			return { ...state,
				localRecordingState : localRecordingState
			};
		}

		case 'SET_CLOUD_RECORDING_STATE':
			{
				const { status } = action.payload;

				const cloudRecordingState = state['cloudRecordingState'];

				cloudRecordingState.status = status;

				return { ...state,
					cloudRecordingState : cloudRecordingState
				};
			}

		case 'SET_CLOUD_RECORDING_CONSENT':
			{
				const { agreed } = action.payload;
				const cloudRecordingState = state['cloudRecordingState'];

				cloudRecordingState.consent = agreed;

				return { ...state,
					cloudRecordingState : cloudRecordingState
				};
			}

		default:
			return state;
	}
};

export default recorder;
