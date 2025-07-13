const ErrorsSteps = {
  no_message_and_buttons: [
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
  ],
  empty_message_and_button_array: [
    {
      id: 'welcome',
      messages: [],
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
      buttons: [],
    },
  ],
  non_existed_step: [
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
  ],
  self_linking: [
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
  ],
  button_without_text_property: [
    {
      id: 'welcome',
      messages: [
        'Привет! Я ваш виртуальный помощник. Нажмите "Начать разговор", чтобы открыть чат',
      ],
      buttons: [
        { // empty is here
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
  ],
  button_without_nextStepId_property: [
    {
      id: 'welcome',
      messages: [
        'Привет! Я ваш виртуальный помощник. Нажмите "Начать разговор", чтобы открыть чат',
      ],
      buttons: [
        {
          text: 'Начать разговор',
          // empty is here
          type: 'button',
        },
      ],
    },
    {
      id: 'start',
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
  ],
  button_without_type_property: [
    {
      id: 'welcome',
      messages: [
        'Привет! Я ваш виртуальный помощник. Нажмите "Начать разговор", чтобы открыть чат',
      ],
      buttons: [
        {
          text: 'Начать разговор',
          nextStepId: 'start',
        },
      ],
    },
    {
      id: 'start',
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
  ],
  wrong_button_type: [
    {
      id: 'welcome',
      messages: [
        'Привет! Я ваш виртуальный помощник. Нажмите "Начать разговор", чтобы открыть чат',
      ],
      buttons: [
        {
          text: 'Начать разговор',
          nextStepId: 'start',
          type: 'button1',
        },
      ],
    },
    {
      id: 'start',
      messages: [
        'Помогу вам выбрать подходящий курс. Выбирайте категорию вопроса, и буквально через пару шагов я смогу рассказать вам то, что нужно.',
      ],
      buttons: [
        {
          text: 'Сменить профессию или трудоустроиться',
          nextStepId: 'switch',
          type: 'button1',
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
  ],
  next_step_without_id: [
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
  ],
}

export default ErrorsSteps
