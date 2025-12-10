// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

contract EloStorage {
	address public owner;
	
	constructor() {
		owner = msg.sender;
	}

	modifier onlyOwner() {
		require(msg.sender == owner, "Only the owner can call this function.");
		_;
	}

	struct EloData {
		uint256 r;
		uint256 rd;
	}

	event EloUpdated(
		uint256 indexed playerId,
		uint256 indexed season,
		uint256 newRating,
		uint256 newRatingDeviation
	);

	mapping(uint256 => mapping(uint256 => EloData)) private playerEloBySeason;

	function usernameToId(string memory username) internal pure returns (uint256) {
		return uint256(keccak256(abi.encodePacked(username)));
	}

	function setEloData(string memory username, uint256 season, uint256 rating, uint256 ratingDeviation) public onlyOwner {

		uint256 IdPlayer = usernameToId(username);

		EloData storage eloPlayer = playerEloBySeason[IdPlayer][season];
		eloPlayer.r = rating;
		eloPlayer.rd =ratingDeviation;

		emit EloUpdated(IdPlayer, season, eloPlayer.r, eloPlayer.rd);
	} 

	function setRatingDeviation(string memory username, uint256 season, uint256 ratingDeviation) public onlyOwner {

		uint256 IdPlayer = usernameToId(username);

		(playerEloBySeason[IdPlayer][season]).rd = ratingDeviation;

		EloData storage eloPlayer = playerEloBySeason[IdPlayer][season];

		emit EloUpdated(IdPlayer, season, eloPlayer.r, eloPlayer.rd);
	}

	function setRating(string memory username, uint256 season, uint256 rating) public onlyOwner {
		uint256 IdPlayer = usernameToId(username);

		(playerEloBySeason[IdPlayer][season]).r = rating;

		EloData storage eloPlayer = playerEloBySeason[IdPlayer][season];

		emit EloUpdated(IdPlayer, season, eloPlayer.r, eloPlayer.rd);
	}

	function getEloData(string memory username, uint256 season) public view returns (uint256 rating, uint256 ratingRd) {

		uint256 IdPlayer = usernameToId(username);

		EloData storage eloPlayer = playerEloBySeason[IdPlayer][season];

		return (eloPlayer.r, eloPlayer.rd);
	}
}
