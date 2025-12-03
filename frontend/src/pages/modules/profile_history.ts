import { getSafeElement } from "../../utils/getSafeElement";
import { setActiveBtn } from "./profile";

const HISTORY = `
history
`;

/** @todo replace by fetching to back */
const HISTORYLIST = {
	lastgame1: {
		date: '29/06/1990',
		time: 886,
		opponent_avatar: '/images/avatar.png',
		opponent_name: 'opponent1',
		elo: 42,
		player_score: 11,
		opponent_score: 0,
	},
	lastgame2: {
		date: '29/06/1990',
		time: 886,
		opponent_avatar: '/images/avatar.png',
		opponent_name: 'opponent_too_long_name',
		elo: -18,
		player_score: 10,
		opponent_score: 11,
	},
	lastgame3: {
		date: '29/06/1990',
		time: 886,
		opponent_avatar: '/images/avatar.png',
		opponent_name: 'opponent2',
		elo: -7,
		player_score: 5,
		opponent_score: 10,
	},
	lastgame4: {
		date: '29/06/1990',
		time: 886,
		opponent_avatar: '/images/avatar.png',
		opponent_name: 'o',
		elo: 42,
		player_score: 11,
		opponent_score: 0,
	},
	lastgame5: {
		date: '29/06/1990',
		time: 886,
		opponent_avatar: '/images/avatar.png',
		opponent_name: 'opponent115465465',
		elo: 42,
		player_score: 11,
		opponent_score: 0,
	},
	lastgame6: {
		date: '29/06/1990',
		time: 886,
		opponent_avatar: '/images/avatar.png',
		opponent_name: 'opponent111233333',
		elo: 42,
		player_score: 11,
		opponent_score: 0,
	},
	lastgame7: {
		date: '29/06/1990',
		time: 886,
		opponent_avatar: '/images/avatar.png',
		opponent_name: 'opponentdwqdwqd',
		elo: 42,
		player_score: 11,
		opponent_score: 0,
	},
	lastgame8: {
		date: '29/06/1990',
		time: 886,
		opponent_avatar: '/images/avatar.png',
		opponent_name: 'dwqdwqdwqd',
		elo: 42,
		player_score: 11,
		opponent_score: 0,
	},
	lastgame9: {
		date: '29/06/1990',
		time: 886,
		opponent_avatar: '/images/avatar.png',
		opponent_name: 'vcxvcxedwev',
		elo: 42,
		player_score: 11,
		opponent_score: 0,
	},
	lastgame10: {
		date: '29/06/1990',
		time: 886,
		opponent_avatar: '/images/avatar.png',
		opponent_name: 'rtbrt26+5+',
		elo: 42,
		player_score: 11,
		opponent_score: 0,
	},
	lastgame11: {
		date: '29/06/1990',
		time: 886,
		opponent_avatar: '/images/avatar.png',
		opponent_name: 'vdfrobert',
		elo: 42,
		player_score: 11,
		opponent_score: 0,
	},
};

function loadHistoryBox(n: number = 0): void {


	if (n > 0) {

	} else if (n === 0) {

	} else {
		throw new Error("cannot load negative history boxes.");
	}
}

function loadHistory(): void {
	const elem = getSafeElement('profile-content', HTMLElement);

	elem.innerHTML = HISTORY;
	setActiveBtn('btn-history');

	/** @todo events */
}

export { HISTORY, loadHistory };
