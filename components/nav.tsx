import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { css, keyframes } from '@emotion/react'
import { Box, Container, Flex, IconButton, Link, useColorMode } from 'theme-ui'
import theme from '../lib/theme'
import Icon from './icon'
import Flag from './flag'
import ScrollLock from 'react-scrolllock'
import NextLink from 'next/link'
import useHasMounted from '../lib/use-has-mounted'

const rgbaBgColor = (props, opacity) =>
  `rgba(
    ${props.bgColor[0]},
    ${props.bgColor[1]},
    ${props.bgColor[2]},
    ${opacity}
  )`

const tokenColor = color =>
  theme.colors[color] ? `var(--theme-ui-colors-${color})` : color || 'inherit'

// const bg = (props) =>
//   props.dark
//     ? css`
//         -webkit-backdrop-filter: saturate(90%) blur(20px);
//         backdrop-filter: saturate(90%) blur(20px);
//       `
//     : css`
//         -webkit-backdrop-filter: saturate(180%) blur(20px);
//         backdrop-filter: saturate(180%) blur(20px);
//       `
const fixed = props =>
  (props.scrolled || props.toggled || props.fixed) &&
  css`
    background-color: ${rgbaBgColor(props, 0.96875)};
    border-bottom: 1px solid
      ${props.dark ? 'rgba(255, 255, 255, 0.16)' : 'rgba(48, 48, 48, 0.125)'};
    @supports (-webkit-backdrop-filter: none) or (backdrop-filter: none) {
      background-color: ${props.transparent
        ? 'transparent'
        : rgbaBgColor(props, props.dark ? 0.8125 : 0.75)};
      -webkit-backdrop-filter: saturate(${props.dark ? '120%' : '180%'})
        blur(20px);
      backdrop-filter: saturate(${props.dark ? '120%' : '180%'}) blur(20px);
    }
  `

const Root = styled(Box, {
  shouldForwardProp: prop =>
    !['bgColor', 'scrolled', 'toggled', 'fixed', 'dark'].includes(prop)
})`
  position: fixed;
  top: 0;
  width: 100vw;
  z-index: 1000;
  ${fixed};
  @media print {
    display: none;
  }
`

const RootAny = Root as any

export const Content = styled(Container)`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  z-index: 2;
`

const hoverColor = (name, dark) =>
  ({
    white: dark ? 'white' : 'smoke',
    smoke: 'muted',
    muted: 'slate',
    slate: dark ? 'white' : 'black',
    black: dark ? 'white' : 'slate',
    primary: 'red'
  })[name] || (dark ? 'white' : 'black')

const slide = keyframes({
  from: { transform: 'translateY(-25%)', opacity: 0 },
  to: { transform: 'translateY(0)', opacity: 1 }
})

const layout = props =>
  props.isMobile
    ? css`
        display: ${props.toggled ? 'flex' : 'none'};
        flex-direction: column;
        overflow-y: auto;
        text-align: left;
        height: 100vh;
        @media (prefers-reduced-motion: no-preference) {
          animation: ${slide} 0.25s ease-in;
        }
        a {
          color: ${tokenColor(props.dark ? 'white' : 'black')} !important;
          margin: 0 auto;
          height: 64px;
          font-weight: bold;
          font-size: ${theme.fontSizes[2]}px;
          width: 100vw;
          &:not(:last-child) {
            border-bottom: 1px solid var(--theme-ui-colors-border);
          }
          @media screen and (max-width: 22em) {
            max-width: 16rem;
          }
        }
      `
    : css`
        @media (min-width: 56em) {
          display: flex;
          justify-content: flex-end;
        }
        a {
          font-size: 18px;
          &:hover {
            text-decoration: underline;
            color: ${tokenColor(hoverColor(props.color, props.dark))};
          }
        }
      `
const NavBar = styled(Box, {
  shouldForwardProp: prop => !['isMobile', 'toggled'].includes(prop)
})`
  display: none;
  ${layout};
  @media (min-width: 56em) {
    margin-left: auto;
  }
  a {
    margin-left: ${theme.space[1]}px;
    padding: ${theme.space[3]}px;
    text-decoration: none;
    @media (min-width: 56em) {
      color: ${props => tokenColor(props.color)};
    }
  }
`

const Navigation = props => (
  // REMINDER: This should be no more than 7 links :)
  (<NavBar role="navigation" {...props}>
    <Link as={NextLink} href="/clubs">Clubs</Link>
    <Link as={NextLink} href="/fiscal-sponsorship">Fiscal&nbsp;Sponsorship</Link>
    <Link as={NextLink} href="/hackathons">Hackathons</Link>
    <Link href="https://slack.hackclub.com">Join</Link>
    <Link href="https://toolbox.hackclub.com/">Toolbox</Link>
    <Link as={NextLink} href="/philanthropy">Donors</Link>
  </NavBar>)
)

const ToggleContainer = styled(Flex)`
  align-items: center;
  justify-content: center;
  min-width: 64px;
  min-height: 44px;
  cursor: pointer;
  user-select: none;
  margin-left: ${theme.space[1]}px;
  @media (min-width: 56em) {
    display: none;
  }
`

const Controls = styled(Flex)`
  align-items: center;
  margin-left: auto;
  @media (min-width: 56em) {
    margin-left: ${theme.space[2]}px;
  }
`

const ThemeToggle = styled(IconButton, {
  shouldForwardProp: prop => prop !== 'activeDark'
})<{ activeDark?: boolean }>`
  min-width: 40px;
  min-height: 40px;
  width: 40px;
  height: 40px;
  padding: 0;
  margin-left: ${theme.space[2]}px;
  border-radius: 9999px;
  cursor: pointer;
  color: ${props =>
    props.activeDark
      ? 'var(--theme-ui-colors-yellow)'
      : 'var(--theme-ui-colors-primary)'};
  background-color: ${props =>
    props.activeDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.9)'};
  border: 1px solid
    ${props =>
      props.activeDark ? 'rgba(255, 255, 255, 0.16)' : 'rgba(48, 48, 48, 0.125)'};
  transition: transform 0.125s ease-in-out, box-shadow 0.125s ease-in-out;
  &:hover,
  &:focus-visible {
    transform: translateY(-1px);
    box-shadow: 0 0 0 2px
      ${props =>
        props.activeDark
          ? 'rgba(255, 255, 255, 0.24)'
          : 'rgba(48, 48, 48, 0.24)'};
    outline: none;
  }
`

type HeaderProps = {
  unfixed?: boolean
  color?: string
  fixed?: boolean
  dark?: boolean
  bgColor?: string | number[]
}

export default function Header({
  unfixed = false,
  color = 'white',
  bgColor,
  dark = false,
  fixed = false,
  ...props
}: HeaderProps) {
  const [colorMode, setColorMode] = useColorMode()
  const [scrolled, setScrolled] = useState(false)
  const [toggled, setToggled] = useState(false)
  const [mobile, setMobile] = useState(false)
  const hasMounted = useHasMounted()

  const onScroll = () => {
    const newState = window.scrollY >= 16

    setScrolled(newState)
  }

  const handleToggleMenu = () => {
    setToggled(t => !t)
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!unfixed) {
        window.addEventListener('scroll', onScroll)
      }

      const mobileQuery = window.matchMedia('(max-width: 48em)')
      mobileQuery.addEventListener('change', () => {
        setMobile(true)
        setToggled(false)
      })
    }

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [unfixed])

  const isDarkMode = dark || colorMode === 'dark'

  const baseColor = isDarkMode
    ? color || 'white'
    : color === 'white' && scrolled
      ? 'black'
      : color
  const toggleColor = isDarkMode
    ? color || 'snow'
    : toggled || (color === 'white' && scrolled)
      ? 'slate'
      : color

  return (
    <RootAny
      {...props}
      fixed={fixed}
      scrolled={scrolled}
      toggled={toggled}
      dark={isDarkMode}
      bgColor={bgColor || (isDarkMode ? [26, 31, 43] : [255, 255, 255])}
      as="header"
    >
      <Content>
        <Flag scrolled={scrolled || fixed} />
        <Navigation
          as="nav"
          aria-hidden={!!mobile}
          color={baseColor}
          dark={isDarkMode}
        />
        <Controls>
          {!dark && hasMounted && (
            <ThemeToggle
              activeDark={colorMode === 'dark'}
              onClick={() => setColorMode(colorMode === 'dark' ? 'light' : 'dark')}
              aria-label={`Switch to ${colorMode === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${colorMode === 'dark' ? 'light' : 'dark'} mode`}
            >
              <Icon glyph={colorMode === 'dark' ? 'sun' : 'moon'} size={20} />
            </ThemeToggle>
          )}
          <ToggleContainer color={toggleColor} onClick={handleToggleMenu}>
            <Icon glyph={toggled ? 'view-close' : 'menu'} />
          </ToggleContainer>
        </Controls>
      </Content>
      <Navigation
        as="nav"
        aria-hidden={!mobile}
        isMobile
        toggled={toggled}
        color={baseColor}
        dark={isDarkMode}
      />
      {toggled && <ScrollLock />}
    </RootAny>
  )
}

