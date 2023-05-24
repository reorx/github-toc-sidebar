import { colors, getLogger } from './utils/log';


const lg = getLogger('popup', colors.bgYellowBright)

lg.info('popup.ts')

document.querySelector('#fn-counter')?.addEventListener('click', () => {
  const numberInput = document.querySelector('input[type=number]') as HTMLInputElement
  numberInput.value = `${parseInt(numberInput.value) + 1}`
})

document.querySelector('#fn-custom-page')?.addEventListener('click', () => {
  chrome.tabs.create({
    url: chrome.runtime.getURL('/custom_page.html')
  });
})
