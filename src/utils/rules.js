
export const requiredRules = () => [
  {
    required: true,
    // message: t('rules.required')
  }
];

export const amountRequiredRules = () => [
  {
    required: true,
    // message: t('rules.required')
  },
  {
    pattern: "^-?\\d{1,9}(\\.\\d{0,2})?$",
    // message: t('rules.format.error')
  }
];
