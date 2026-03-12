import base from '@hackclub/theme'
import { merge } from 'lodash'

const theme = base

theme.config.useColorSchemeMediaQuery = true

theme.colors.modes.dark = merge(theme.colors.modes.dark, {
  black: '#0f1422',
  darker: '#121a2a',
  dark: '#171f31',
  darkless: '#202b3f',
  steel: '#94a4bd',
  slate: '#bcc9dd',
  smoke: '#2b364c',
  snow: '#1b2436',
  text: theme.colors.white,
  background: '#171f31',
  elevated: '#202b3f',
  sheet: '#1d293b',
  sunken: '#10182a',
  border: '#364560',
  placeholder: '#74839d',
  secondary: '#9fb0c7',
  muted: '#9fb0c7',
  accent: theme.colors.cyan,
  primary: theme.colors.red
})

theme.buttons.primary = merge(theme.buttons.primary, {
  textTransform: 'uppercase'
})

theme.layout.copy.maxWidth = [null, null, 'copyPlus']

theme.text.title.fontSize = [5, 6]

export default theme
