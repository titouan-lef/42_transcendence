/* eslint-disable */
const ABI = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "playerId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "season",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "newRating",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "newRatingDeviation",
          "type": "uint256"
        }
      ],
      "name": "EloUpdated",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "currentVersion",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string[]",
          "name": "usernames",
          "type": "string[]"
        },
        {
          "internalType": "uint256",
          "name": "season",
          "type": "uint256"
        }
      ],
      "name": "getAllRatingBySeason",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "username",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "season",
          "type": "uint256"
        }
      ],
      "name": "getEloData",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "rating",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "ratingDeviation",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "resetAll",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "username",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "season",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "rating",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "ratingDeviation",
          "type": "uint256"
        }
      ],
      "name": "setEloData",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "username",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "season",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "ratingDeviation",
          "type": "uint256"
        }
      ],
      "name": "setRatingDeviation",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ] as const

export { ABI };
