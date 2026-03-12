import { useEffect } from 'react'
import { useColorMode } from 'theme-ui'

const ForceTheme = ({ theme }) => {
  const [colorMode, setColorMode] = useColorMode()

  useEffect(() => {
    if (theme === 'light') return
    if (colorMode !== theme) setColorMode(theme)
  }, [colorMode, setColorMode, theme])

  return null
}

export default ForceTheme
