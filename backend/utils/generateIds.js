// Generate unique IDs for various entities

const generateOrderId = () => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD${timestamp}${random}`;
};

const generateExchangeId = () => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `EXC${timestamp}${random}`;
};

const generateRedemptionId = () => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `RDM${timestamp}${random}`;
};

const generateRewardId = () => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `RWD${timestamp}${random}`;
};

const generateTrackingNumber = () => {
  const prefix = 'RW';
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}${timestamp}${random}`;
};

module.exports = {
  generateOrderId,
  generateExchangeId,
  generateRedemptionId,
  generateRewardId,
  generateTrackingNumber
};
