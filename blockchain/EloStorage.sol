// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

contract EloStorage {
	address public owner;
	
	constructor()
	{
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
		uint256 newRatingRd
	);

	mapping(uint256 => mapping(uint256 => EloData)) private playerEloBySeason;

	function usernameToId(string memory username) internal pure returns (uint256) {
		return uint256(keccak256(abi.encodePacked(username)));
	}

	function setEloData(string memory username, uint256 season, uint256 rating, uint256 ratingRd) public onlyOwner
	{
		uint256 IdPlayer = usernameToId(username);

		(playerEloBySeason[IdPlayer][season]).r = rating;
		(playerEloBySeason[IdPlayer][season]).rd = ratingRd;

		emit EloUpdated(IdPlayer, season, rating, ratingRd);
	}

	function setRatingRd(string memory username, uint256 season, uint256 ratingRd) public onlyOwner
	{
		uint256 IdPlayer = usernameToId(username);
		uint256 currentRating = playerEloBySeason[IdPlayer][season].r;

		(playerEloBySeason[IdPlayer][season]).rd = ratingRd;

		emit EloUpdated(IdPlayer, season, currentRating, ratingRd);
	}

	function setRating(string memory username, uint256 season, uint256 rating) public onlyOwner
	{
		uint256 IdPlayer = usernameToId(username);
		uint256 currentRatingRd = playerEloBySeason[IdPlayer][season].rd;

		(playerEloBySeason[IdPlayer][season]).r = rating;

		emit EloUpdated(IdPlayer, season, rating, currentRatingRd);
	}

	function getEloData(string memory username, uint256 season) public view returns (uint256 rating, uint256 ratingRd)
	{
		uint256 IdPlayer = usernameToId(username);
		return ((playerEloBySeason[IdPlayer][season]).r, (playerEloBySeason[IdPlayer][season]).rd);
	}
}
