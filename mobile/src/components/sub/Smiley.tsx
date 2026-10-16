import Svg, {Path} from 'react-native-svg';

type Props = {
  mood: 'happy' | 'sad' | 'starry';
};

// The hand-drawn smileys from the result cards in the design sheet: green happy, red sad, green with star eyes.
const Smiley = ({mood}: Props) => {
  const color = mood === 'sad' ? '#b8322a' : '#2f6f4f';
  if (mood === 'starry') {
    return (
      <Svg width={26} height={26} viewBox="0 0 22 22" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M11 1.5 C 17.5 1.5, 20.5 6, 20.5 11 C 20.5 16.5, 16.5 20.5, 11 20.5 C 5 20.5, 1.5 16.5, 1.5 11 C 1.5 5.5, 5.5 1.5, 12 2" />
        <Path d="M7 5.8 L 7.8 8.2 L 10.2 9 L 7.8 9.8 L 7 12.2 L 6.2 9.8 L 3.8 9 L 6.2 8.2 Z" fill={color} />
        <Path d="M15 5.8 L 15.8 8.2 L 18.2 9 L 15.8 9.8 L 15 12.2 L 14.2 9.8 L 11.8 9 L 14.2 8.2 Z" fill={color} />
        <Path d="M6 13.5 L 16 13.5 C 14.5 17.8, 7.5 17.8, 6 13.5 Z" />
      </Svg>
    );
  }
  return (
    <Svg width={22} height={22} viewBox="0 0 22 22" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
      <Path d="M11 2 C 17 2, 20 6, 20 11 C 20 16, 16 20, 11 20 C 5 20, 2 16, 2 11 C 2 6, 6 2, 12 2.5" />
      <Path d="M8 8.5 L 8 9.5 M14 8.3 L 14 9.3" />
      <Path d={mood === 'happy' ? 'M6.5 13 C 9 16.5, 13.5 16.5, 15.5 12.8' : 'M6.5 15.5 C 9 12.5, 13 12.5, 15.5 15.8'} />
    </Svg>
  );
};

export default Smiley;
