import Svg, {Path} from 'react-native-svg';

// A slightly lopsided red blob, like a dot pressed on with a felt pen.
const LiveDot = () => (
  <Svg width={12} height={12} viewBox="0 0 12 12">
    <Path d="M6 1.2 C 9.1 1, 11 3.4, 10.8 6.3 C 10.6 9.2, 8.2 11, 5.6 10.8 C 2.9 10.6, 1.1 8.5, 1.3 5.7 C 1.5 3, 3.4 1.4, 6 1.2" fill="#b8322a" />
  </Svg>
);

export default LiveDot;
