const getValue = (name, list) => {
  const [pair] = list.filter(item => item.label == name)
  return pair.value
}

export { getValue }
