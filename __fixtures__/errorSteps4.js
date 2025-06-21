// nextStepId links to itself
const Steps4 = [
  {
    id: 'welcome',
    messages: [
      'Привет! Я ваш виртуальный помощник. Нажмите "Начать разговор", чтобы открыть чат',
    ],
    buttons: [
      {
        text: 'welcome again',
        nextStepId: 'welcome',
        type: 'button',
      },
    ],
  },
]

export default Steps4
