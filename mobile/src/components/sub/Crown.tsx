import {StyleProp, ViewStyle} from 'react-native';
import Svg, {Path} from 'react-native-svg';

type Props = {
  style?: StyleProp<ViewStyle>;
};

// Blue hand-drawn crown: marks a league you own.
const Crown = ({style}: Props) => (
  <Svg style={style} width={30} height={20} viewBox="0 0 30 20" fill="none">
    <Path
      d="M4 17 L 3 5 L 10 11 L 15 2 L 20 11 L 27 4 L 26 17 C 19 18, 11 18, 4 17"
      stroke="#2b4fb3"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default Crown;
