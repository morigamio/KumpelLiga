import Svg, {G, Path} from 'react-native-svg';

const INK = '#26262b';
const BLUE = '#2b4fb3';

// Two doodled buddies with arrows pointing at them from the "Kumpels" / "Kumpeline" labels.
const BuddiesDoodle = () => {
  return (
    <Svg width={326} height={176} viewBox="0 0 326 176" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <G stroke={BLUE} strokeWidth={2.5}>
        <G transform="translate(50 24)">
          <Path d="M4 4 C 20 4, 34 14, 42 30" />
          <Path d="M32 27 L 42 31 L 45 20" />
        </G>
        <G transform="translate(228 24)">
          <Path d="M46 4 C 30 4, 16 14, 8 30" />
          <Path d="M18 27 L 8 31 L 5 20" />
        </G>
      </G>
      <G transform="translate(48 16) scale(1.045)" stroke={INK} strokeWidth={3.5}>
        <Path d="M75 22 C 98 21, 107 45, 105 62 C 103 84, 90 99, 74 98 C 55 97, 44 80, 45 60 C 46 40, 56 23, 77 23" />
        <Path d="M148 20 C 171 19, 180 43, 178 60 C 176 82, 163 97, 147 96 C 128 95, 117 78, 118 58 C 119 38, 129 21, 150 21" />
        <Path d="M60 56 q6 -6 12 0 M80 55 q6 -6 12 0 M133 54 q6 -6 12 0 M153 53 q6 -6 12 0" />
        <Path d="M65 72 q10 11 20 0 M137 70 q11 12 22 0" />
        <Path d="M40 142 C 44 120, 56 106, 72 101" />
        <Path d="M78 104 C 100 98, 130 96, 158 100 C 174 103, 186 112, 191 126" />
        <Path d="M150 98 C 166 101, 180 118, 184 142" />
        <Path d="M118 96 C 108 104, 104 122, 104 142" />
      </G>
    </Svg>
  );
};

export default BuddiesDoodle;
