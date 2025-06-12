// link to itself
const steps = [
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

export default steps
