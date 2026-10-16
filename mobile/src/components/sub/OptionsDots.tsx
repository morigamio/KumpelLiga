import Svg, {Ellipse} from 'react-native-svg';

// Three slightly uneven ink dots, the hand-drawn "⋯" for an options menu.
const OptionsDots = () => (
  <Svg width={28} height={10} viewBox="0 0 28 10" fill="#26262b">
    <Ellipse cx={4} cy={5.5} rx={3.2} ry={3} />
    <Ellipse cx={14} cy={4.8} rx={3} ry={3.2} />
    <Ellipse cx={24} cy={5.3} rx={3.2} ry={3.1} />
  </Svg>
);

export default OptionsDots;
