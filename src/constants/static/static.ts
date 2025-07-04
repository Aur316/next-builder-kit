export const DROPDOWN_OPTIONS = [
  { value: 'react', label: '⚛️ React' },
  { value: 'nextjs', label: '⚫ Next.js' },
  { value: 'solid', label: '🧱 SolidJS' },
  { value: 'svelte', label: '🔥 Svelte' },
  { value: 'vue', label: '🟢 Vue.js' },
]

export const LANGUAGES = [
  { value: 'en', label: '🇬🇧 English' },
  { value: 'hu', label: '🇭🇺 Magyar' },
]

export const RADIO_OPTIONS = [
  { value: 'yes', label: 'homePage.yesRadio' },
  { value: 'no', label: 'homePage.noRadio' },
]

export const EXTENDED_RADIO_OPTIONS = [
  { value: 'option1', label: 'homePage.option1' },
  { value: 'option2', label: 'homePage.option2' },
  { value: 'option3', label: 'homePage.option3' },
  { value: 'option4', label: 'homePage.option4' },
  { value: 'option5', label: 'homePage.option5' },
  { value: 'option6', label: 'homePage.option6' },
]

export const initialFormData = {
  name: '',
  email: '',
  message: '',
  framework: '',
  notification: false,
  isAgreed: false,
  radioChoice: '',
  files: [],
}
