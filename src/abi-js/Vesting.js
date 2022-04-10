export default [
  "function getTokenGrant(address _recipient) external view returns (tuple(uint256 amount, uint256 totalClaimed, uint256 perSecond))",
  "function blacklist(address) public view returns (address)",
  "function calculateGrantClaim(address _recipient) public view returns (uint256)",
  "function claimVestedTokens(address _recipient) external",
  "function addTokenGrants(address[] memory _recipients, uint256[] memory _amounts) external onlyOwner",
  "function changeInvestor(address _oldAddress, address _newAddress) external onlyOwner",
  "function transferOwnership(address newOwner) public virtual onlyOwner",
];
