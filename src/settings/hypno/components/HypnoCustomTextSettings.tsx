import { PropsWithChildren } from 'react'
import { AnimatePresence, motion, HTMLMotionProps } from 'framer-motion'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faMinus,
  faPlus,
} from '@fortawesome/free-solid-svg-icons'
import {
  SettingsLabel,
  Button,
  TextInput,
  Space,
} from '../../../common'
import { GameHypnoType } from '../../../types'
import { defaultTransition } from '../../../utils'
import { useSetting, subsetting, HypnoTextEntry } from '../../SettingsProvider'

// -------------------- SettingsTile from common using motion
interface MotionSettingsTileProps
extends PropsWithChildren<Omit<HTMLMotionProps<'fieldset'>, 'ref'>> {
  label: React.ReactNode
  grid?: boolean
}

const MotionStyledSettingsTile = styled(motion.fieldset)<{ $grid?: boolean }>`
  display: ${({ $grid }) => ($grid ? 'grid' : 'flex')};
  flex-direction: column;
  grid-template-columns: auto 1fr auto;
  grid-auto-rows: min-content;

  background: var(--section-background);
  color: #b9bad6;

  font-size: 0.8rem;

  border: unset;
  border-left: 2px solid var(--legend-background);

  margin: 15px;
  padding: 5px 15px;

  position: relative;
`

const StyledSettingsLabel = styled.legend`
  width: fit-content;
  padding: 4px 8px;
  background: var(--legend-background);
  color: var(--legend-color);
  line-height: 100%;
  font-size: 1rem;
`

const MotionSettingsTile: React.FC<MotionSettingsTileProps> = ({
  label,
  children,
  grid,
  ...props
}) => {
  return (
    <MotionStyledSettingsTile $grid={grid} {...props}>
      <StyledSettingsLabel>{label}</StyledSettingsLabel>
      {children}
    </MotionStyledSettingsTile>
  )
}
// --------------------

const StyledSettingsDescription = styled.p`
  line-height: 1.1;
  max-width: 100%;
  text-wrap: wrap;
  grid-column: 1 / -1;
  margin: 10px 0px;
`;

const HypnoRow = styled.div`
  display: grid;
  grid-template-columns: auto auto auto auto;
  gap: 8px;
  align-items: center;
  padding: 4px;
  border-radius: 4px;
  background: var(--card-background);
`

const Unit = styled.div`
  position: relative;
  pointer-events: none;
  user-select-none:
  color: #666;
  right: 5px;
  text-align: right;
`

export const HypnoCustomTextSettings = () => {
  const h = useSetting('hypno')
  const [hypno] = h
  const [customMaster, setCustomMaster] = subsetting(h, 'textCustomMaster')
  const [customHands, setCustomHands] = subsetting(h, 'textCustomHands')
  const [custom, setCustom] = subsetting(h, 'textCustom')

  const addRow = () => setCustom((p: HypnoTextEntry[]) => {
    const rid = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
    if (p.length == 0) return [{ id: rid, text: '', start: 0, duration: 1 }]
    return [...p, { id: rid, text: '', start: p[p.length - 1]!.start + p[p.length - 1]!.duration, duration: 1 }]
  })
  function updateRow<S extends keyof HypnoTextEntry>(ix: number, key: S, val: HypnoTextEntry[S]) {
    setCustom((p: HypnoTextEntry[]) => p.map((v, i) => (i === ix ? { ...p[ix]!, [key]: val } : v)))
  }
  const removeRow = (ix: number) => setCustom((p: HypnoTextEntry[]) => [...p.slice(0, ix), ...p.slice(ix + 1)])

  return (
    <AnimatePresence>
      {hypno.textType === GameHypnoType.custom && (
        <MotionSettingsTile
          grid={true}
          label={'Hypno Custom Text'}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={defaultTransition}
        >
          <StyledSettingsDescription>
            Variables:<br />
            <b>$part</b> - selected genitalia, <b>$stroke</b> - genitalia touch word, <b>$player</b> - third pronoun, <b>$master</b>, <b>$hands</b><br />
            Flavors:<br />
            <b>$part</b> - lowercase, <b>$Part</b> - capitalized, <b>$PART</b> - uppercase
          </StyledSettingsDescription>
          <SettingsLabel htmlFor='customMaster'>Custom Master</SettingsLabel>
          <TextInput
            id='customMaster'
            style={{ gridColumn: '2 / -1' }}
            value={customMaster}
            onChange={setCustomMaster}
          />
          <Space size='medium' />
          <SettingsLabel htmlFor='customHands'>Custom Hands</SettingsLabel>
          <TextInput
            id='customHands'
            style={{ gridColumn: '2 / -1' }}
            value={customHands}
            onChange={setCustomHands}
          />
          <Space size='medium' />
          <div style={{ gridColumn: '1 / -1' }}>
            <AnimatePresence>
              {custom.map((el, ix) => {
                return (
                  <motion.div
                    key={el.id}
                    transition={defaultTransition}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    data-ix={ix}
                  >
                    <HypnoRow>
                      <Button onClick={() => removeRow(ix)}>Delete <FontAwesomeIcon icon={faMinus} /></Button>
                      <TextInput style={{ gridColumn: '2 / -1' }} value={el.text} placeholder='Hypno text...' onChange={v => updateRow(ix, 'text', v)} />
                      <SettingsLabel htmlFor={`${ix}-start`}>Start at</SettingsLabel>
                      <TextInput style={{ gridRow: '2', gridColumn: '2' }} value={el.start.toString()} onChange={v => {if (!isNaN(parseFloat(v))) updateRow(ix, 'start', parseFloat(v))}} />
                      <Unit style={{ gridRow: '2', gridColumn: '2' }}>s</Unit>
                      <SettingsLabel style={{ gridColumn: '3' }} htmlFor={`${ix}-duration`}>Duration</SettingsLabel>
                      <TextInput style={{ gridRow: '2', gridColumn: '4' }} value={el.duration.toString()} onChange={v => {if (!isNaN(parseFloat(v))) updateRow(ix, 'duration', parseFloat(v))}} />
                      <Unit style={{ gridRow: '2', gridColumn: '4' }}>s</Unit>
                    </HypnoRow>
                    <Space size='medium' />
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
          <Space size='small' />
          <Button style={{ gridColumn: '1 / -1' }} onClick={addRow}>Add entry <FontAwesomeIcon icon={faPlus} /></Button>
        </MotionSettingsTile>
      )}
    </AnimatePresence>
  )
}

