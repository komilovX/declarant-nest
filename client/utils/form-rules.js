export function mapRulesByValue(rules) {
  const newRules = {}
  rules.forEach((rule) => {
    newRules[`${rule}`] = [
      {
        required: true,
        message: 'Пожалуйста заполните это поле',
        trigger: 'change',
      },
    ]
  })
  return newRules
}
