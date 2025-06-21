// next step doesn't have id
const Steps9 = [
  {
    id: 'welcome',
    messages: [
      'Привет! Я ваш виртуальный помощник. Нажмите "Начать разговор", чтобы открыть чат',
    ],
    buttons: [
      {
        text: 'Начать разговор',
        nextStepId: 'start',
        type: 'button',
      },
    ],
  },
  { // empty is here
    messages: [
      'Помогу вам выбрать подходящий курс. Выбирайте категорию вопроса, и буквально через пару шагов я смогу рассказать вам то, что нужно.',
    ],
    buttons: [
      {
        text: 'Сменить профессию или трудоустроиться',
        nextStepId: 'switch',
        type: 'button',
      },
      {
        text: 'Попробовать себя в IT',
        nextStepId: 'try',
        type: 'button',
      },
      {
        text: 'Я разработчик, хочу углубить свои знания',
        nextStepId: 'advanced',
        type: 'button',
      },
    ],
  },
]

export default Steps9
