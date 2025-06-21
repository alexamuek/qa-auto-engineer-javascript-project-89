// step doesn't have message
// step doesn't have buttons
const Steps1 = [
  {
    id: 'welcome',
    buttons: [
      {
        text: 'Начать разговор',
        nextStepId: 'start',
        type: 'button',
      },
    ],
  },
  {
    id: 'start',
    messages: [
      'Помогу вам выбрать подходящий курс. Выбирайте категорию вопроса, и буквально через пару шагов я смогу рассказать вам то, что нужно.',
    ],
  },
]

export default Steps1
