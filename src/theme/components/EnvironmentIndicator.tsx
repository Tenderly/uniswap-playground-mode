import { useActiveTenderlyFork } from 'hooks/useTenderlyFork'
import styled from 'styled-components/macro'

const Label = styled.div`
  display: inline-flex;
  padding: 2px 12px;
  align-items: flex-start;
  gap: 8px;
  border-radius: 0px 0px 4px 4px;
  background: var(--primary-09, #6e56cf);
  color: #fff;
  font-size: 14px;
  font-family: Inter;
  font-weight: 600;
  line-height: 20px;
`

const Line = styled.div`
  width: 100%;
  flex-shrink: 0;
  border: 1px solid var(--primary-09, #6e56cf);
  background: #fff;
`

const EnvironmentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 0;
`

export default function EnvironmentIndicator() {
  const { tenderlyFork } = useActiveTenderlyFork()
  if (!tenderlyFork) {
    return null
  }
  return (
    <EnvironmentWrapper>
      <Line />
      <Label>FORK</Label>
    </EnvironmentWrapper>
  )
}
