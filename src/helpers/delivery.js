// Calculate amount of delivery based on its weight and region
const calculateDeliveryAmount = (weight, region) => {
  let amount = 0;
  switch (region) {
    case 'Europe':
      amount = weight * 160;
      break;
    case 'America':
      amount = weight * 220;
      break;
    case 'Asia':
      amount = weight * 240;
      break;
    case 'Australia':
      amount = weight * 260;
      break;
    default:
      if (weight > 3) {
        const updatedWeight = weight - 3;
        const updatedAmount = updatedWeight * 5;
        amount = updatedAmount + 120;
      } else {
        amount = weight * 40;
      }
      break;
  }
  return amount;
};

// Set delivery type (National or International) based on region (Local = National)
const setDeliveryType = (region) => {
  const type = region !== 'Local' ? 'International' : 'National';
  return type;
};

module.exports = {
  calculateDeliveryAmount,
  setDeliveryType,
};
