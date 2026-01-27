const DATA = {
  Bricks: [{ id: 1, name: "Red Brick", price: 8 }],
  Cements: [{ id: 2, name: "UltraTech", price: 420 }],
};

export const getProductsByCategory = (category) => {
  return DATA[category] || [];
};
