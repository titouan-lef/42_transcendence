// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract EloStorage {

	mapping(uint256 => mapping(uint256 => uint256)) private playerEloBySeason;

	function usernameToId(string memory username) internal pure returns (uint256) {
	return uint256(keccak256(abi.encodePacked(username)));
	}

	function setElo(string memory username, uint256 season, uint256 elo) public
	{
		uint256 IdPlayer = usernameToId(username);
		playerEloBySeason[IdPlayer][season] = elo;
	}

	function getElo(string memory username, uint256 season) public view returns (uint256)
	{
		uint256 IdPlayer = usernameToId(username);
		return playerEloBySeason[IdPlayer][season];
	}

	function updateElo(string memory username, uint256 season, int256 change) public
	{
		uint256 IdPlayer = usernameToId(username);
		uint256 current = playerEloBySeason[IdPlayer][season];
		if (change >= 0)
		{
			playerEloBySeason[IdPlayer][season] = current + uint256(change);
			return;
		}
		uint256 loose = uint256(-change);
		if (loose < current)
			playerEloBySeason[IdPlayer][season] = current - loose;
		else
			playerEloBySeason[IdPlayer][season] = 1;
	}
}
