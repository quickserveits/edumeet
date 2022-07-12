const initialState = {
	launchOpen : false,
	questions  : [],
	roomId     : '',
	adminId    : ''
};

const launchRoom = (state = initialState, action) =>
{
	switch (action.type)
	{
		case 'SET_OPEN_LAUNCH_POLL':
		{
			const {
				launchOpen,
				questions,
				roomId,
				adminId
			} = action.payload.launchPoll;

			return { ...state,
				launchOpen,
				questions,
				roomId,
				adminId
			};
		}

		case 'SET_OPEN_LAUNCH_POLL_ERROR':
			{
				const { data } = action.payload;

				return { ...state,
					launchOpen : data,
					questions  : [],
					roomId     : '',
					adminId    : ''
				};
			}

		default:
			return state;
	}
};

export default launchRoom;
