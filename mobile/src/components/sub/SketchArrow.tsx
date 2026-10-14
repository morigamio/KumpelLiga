import Svg, {Path} from 'react-native-svg';

type Props = {
  direction: 'left' | 'right';
};

const PATHS = {
  left: 'M11 3 C 7 7, 4 9, 3 11 C 5 14, 8 16, 11 19',
  right: 'M3 3 C 7 7, 10 9, 11 11 C 9 14, 6 16, 3 19',
};

// Hand-drawn chevron pointing left or right.
const SketchArrow = ({direction}: Props) => {
  return (
    <Svg width={14} height={22} viewBox="0 0 14 22" fill="none">
      <Path
        d={PATHS[direction]}
        stroke="#26262b"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default SketchArrow;
