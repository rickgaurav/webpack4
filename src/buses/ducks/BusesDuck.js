const initial_state = {
	tickets: ['ticket1', 'ticket2']
};

export default function reducer(state, action) {
	state = state || initial_state;

	switch(action.type) {
		default:
			return state;
	}
}