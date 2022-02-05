import Row from '../grid/Row'
import { FunctionComponent } from 'react' // we need this to make JSX compile

type ComponentType = {
  items: string[]
  value: number
  itemWidth: number
  onChange: (index: number) => void
}

const SegmentControl: FunctionComponent<ComponentType> = ({
  items,
  onChange,
  value,
  itemWidth,
}) => {
  return (
    <Row className='flex-row segmented-control__container'>
      <div
        style={{ left: value * itemWidth, width: itemWidth }}
        className='segmented-control__button'
      >
        <div className='segmented-control__button-inner' />
      </div>
      {items.map((item, i) => (
        <div
          key={item}
          style={{ left: itemWidth * i, width: itemWidth }}
          onClick={() => {
            onChange(i)
          }}
          className='segmented-control__item'
        >
          {item}
        </div>
      ))}
    </Row>
  )
}

export default SegmentControl
