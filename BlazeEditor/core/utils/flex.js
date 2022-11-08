import * as go from 'gojs'
const $ = go.GraphObject.make

const DIRECTIONS = {
  column: 'Vertical',
  row: 'Horizontal'
}

const align = {
  y: {
    start: 'Top',
    end: 'Bottom',
    center: 'Center'
  },
  x: {
    start: 'Left',
    end: 'Right',
    center: 'Center'
  }
}

const alignCombo = (direction, { justifyContent, alignItems }) => {
  const just = justifyContent || 'start'
  const alig = alignItems || 'start'

  const x = direction === 'row' ? just : alig
  const y = direction === 'row' ? alig : just

  let textAlign = `${align.y[y]}${align.x[x]}`

  if (x === 'center' && y === 'center') { textAlign = 'Center' } else if (y === 'center') { textAlign = `${align.x[x]}Center` }

  console.log('textAlign: ', textAlign)

  return go.Spot[textAlign]
}

const optionInterpreter = (direction, flexOptions) => {
  const options = {
    defaultAlignment: alignCombo(direction, flexOptions),
    alignment: alignCombo(direction, flexOptions),
    stretch: go.GraphObject[direction],
    defaultStretch: go.GraphObject[direction === 'Vertical' ? 'Horizontal' : 'Vertical']
  }

  if (flexOptions.margin) { options.margin = flexOptions.margin }
  if (flexOptions.width) { options.width = flexOptions.width }
  if (flexOptions.height) { options.height = flexOptions.height }
  // if (flexOptions.stretch)  options.;

  return options
}

const panel = (flexDirection, children) => {
  const options = !children[0].__gohashid ? children.shift() : {}
  const [direction, reverse] = flexDirection.split('-')
  const panelOptions = optionInterpreter(direction, { ...options, isOpposite: !!reverse })

  console.log(panelOptions)

  // if (options.stretch) return $(go.Panel, DIRECTIONS[direction], $(go.Panel, "Auto",  panelOptions, children ));
  return $(go.Panel, DIRECTIONS[direction], panelOptions, children)
}

export default (direction, ...children) => panel(
  direction,
  children
)
