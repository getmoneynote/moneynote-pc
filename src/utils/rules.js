export const requiredRules = () => [
  {
    required: true,
  }
];

export const amountRequiredRules = () => [
  {
    required: true,
  },
  {
    pattern: "^-?\\d{1,9}(\\.\\d{0,2})?$",
  }
];
