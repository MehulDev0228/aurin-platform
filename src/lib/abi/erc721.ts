// src/lib/abi/erc721.ts
export const ERC721_ABI = [
  {
    "inputs":[
      {"internalType":"address","name":"to","type":"address"},
      {"internalType":"string","name":"tokenURI","type":"string"}
    ],
    "name":"safeMint","outputs":[], "stateMutability":"nonpayable","type":"function"
  },
  {
    "inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],
    "name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],
    "stateMutability":"view","type":"function"
  }
];
