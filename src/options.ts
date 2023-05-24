import { colors, getLogger } from './utils/log';


const lg = getLogger('options', colors.bgYellowBright)

lg.info('options.ts')

document.querySelector('button')?.addEventListener('click', () => {
  const numberInput = document.querySelector('input[type=number]') as HTMLInputElement
  numberInput.value = `${parseInt(numberInput.value) + 1}`
})
