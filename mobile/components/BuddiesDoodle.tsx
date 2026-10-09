import Svg, {G, Path} from 'react-native-svg';

const INK = '#26262b';

// Two doodled buddies above the KumpelLiga title.
const BuddiesDoodle = () => {
  return (
    <Svg width={210} height={172} viewBox="35 15 165 135" style={{alignSelf: 'center'}} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <G stroke={INK} strokeWidth={3.5}>
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
