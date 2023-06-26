// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import styled from 'styled-components/macro'
import { flexRowNoWrap } from 'theme/styles'

// https://stackoverflow.com/a/31617326
const FULL_BORDER_RADIUS = 9999

const StyledTenderizeButton = styled.button`
  background-color: transparent;
  border: none;
  border-top-left-radius: ${FULL_BORDER_RADIUS}px;
  border-bottom-left-radius: ${FULL_BORDER_RADIUS}px;
  cursor: pointer;
  font-weight: 600;
  font-size: 16px;
  padding: 10px 12px;
  color: inherit;
`

const Web3StatusConnectWrapper = styled.div<{ faded?: boolean }>`
  ${flexRowNoWrap};
  align-items: center;
  background-color: ${({ theme }) => theme.accentActionSoft};
  border-radius: ${FULL_BORDER_RADIUS}px;
  border: none;
  padding: 0;
  height: 40px;

  color: ${({ theme }) => theme.accentAction};
  :hover {
    color: ${({ theme }) => theme.accentActionSoft};
    stroke: ${({ theme }) => theme.accentActionSoft};
  }

  transition: ${({
    theme: {
      transition: { duration, timing },
    },
  }) => `${duration.fast} color ${timing.in}`};
`
