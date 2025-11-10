// src/lib/abi/erc1155.ts
export const ERC1155_ABI = [
  {
    "inputs":[
      {"internalType":"address","name":"to","type":"address"},
      {"internalType":"uint256","name":"id","type":"uint256"},
      {"internalType":"uint256","name":"amount","type":"uint256"},
      {"internalType":"bytes","name":"data","type":"bytes"}
    ],
    "name":"mintTo","outputs":[], "stateMutability":"nonpayable","type":"function"
  },
  {
    "inputs":[{"internalType":"uint256","name":"id","type":"uint256"}],
    "name":"uri","outputs":[{"internalType":"string","name":"","type":"string"}],
    "stateMutability":"view","type":"function"
  }
];
