const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log('🧪 Creating 15-Second Test Policy\n');

  // Load deployment info
  const deploymentFile = path.join(__dirname, '..', 'deployments', 'localhost.json');
  const deploymentInfo = JSON.parse(fs.readFileSync(deploymentFile, 'utf8'));
  
  const policyFactoryAddress = deploymentInfo.contracts.PolicyFactory.address;
  
  // Get contracts
  const PolicyFactory = await hre.ethers.getContractFactory("PolicyFactory");
  const policyFactory = PolicyFactory.attach(policyFactoryAddress);
  
  // Get signer (use account 2 as farmer)
  const signers = await hre.ethers.getSigners();
  const farmer = signers[1];
  
  console.log('👤 Farmer:', await farmer.getAddress());
  
  const productId = 1;
  const durationSeconds = 15; // 15 seconds
  const threshold = 100;
  
  const product = await policyFactory.getProduct(productId);
  const minDurationForPricing = Number(product.minDurationDays);
  
  const [premiumWei, payoutWei] = await policyFactory.pricePolicy(productId, minDurationForPricing);
  
  console.log('📋 Policy Details:');
  console.log('   Product ID:', productId);
  console.log('   Duration: 15 seconds');
  console.log('   Threshold:', threshold, 'mm');
  console.log('   Premium:', hre.ethers.formatEther(premiumWei), 'ETH');
  console.log('   Payout:', hre.ethers.formatEther(payoutWei), 'ETH');
  console.log('');
  
  console.log('📝 Creating policy...');
  const tx = await policyFactory.connect(farmer).createTestPolicy(
    productId,
    durationSeconds,
    threshold,
    { value: premiumWei }
  );
  
  const receipt = await tx.wait();
  console.log('✅ Policy created! Tx:', receipt.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
