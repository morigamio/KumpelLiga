import Svg, {Path} from 'react-native-svg';

type Props = {
  size?: number;
  color?: string;
};

// One buddy from the login doodle (head, face, shoulders), as a small icon.
const BuddyIcon = ({size = 22, color = '#5a5850'}: Props) => {
  return (
    <Svg width={size * 0.66} height={size} viewBox="34 16 82 128" fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M75 22 C 98 21, 107 45, 105 62 C 103 84, 90 99, 74 98 C 55 97, 44 80, 45 60 C 46 40, 56 23, 77 23" />
      <Path d="M60 56 q6 -6 12 0 M80 55 q6 -6 12 0" />
      <Path d="M65 72 q10 11 20 0" />
      <Path d="M40 140 C 44 120, 56 106, 72 102 M78 102 C 94 106, 106 120, 110 140" />
    </Svg>
  );
};

export default BuddyIcon;
