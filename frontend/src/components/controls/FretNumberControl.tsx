import React from 'react'
import ControlGroup from './ControlGroup'
import SegmentedControl from './SegmentedControl'

interface FretNumberControl {
  state: any;
  fret_options: any;
  set: any;
}

const FretNumberControl = ({state, fret_options, set}: FretNumberControl) => {
  return (
         <ControlGroup label="Frets">
          <SegmentedControl
            options={fret_options}
            value={state.frets}
            onChange={(v) => set({ frets: v })}
          />
        </ControlGroup>
  )
}

export default FretNumberControl