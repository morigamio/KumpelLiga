import {ReactNode, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Svg, {Path} from 'react-native-svg';

type Props = {
  color: string;
  // Slight tilt in degrees, so not every ring sits perfectly straight.
  tilt?: number;
  children: ReactNode;
};

// A pen ring around (w × h): slightly uneven, and the stroke ends a bit past its start,
// like a circle drawn in one go.
const ringPath = (w: number, h: number) => {
  const cx = w / 2;
  const cy = h / 2;
  const rx = w / 2 - 2;
  const ry = h / 2 - 2;
  const p = (x: number, y: number) => `${(cx + x * rx).toFixed(1)} ${(cy + y * ry).toFixed(1)}`;
  return [
    `M ${p(0.2, -1.02)}`,
    `C ${p(0.75, -1)}, ${p(1.02, -0.6)}, ${p(1, 0.05)}`,
    `C ${p(0.98, 0.6)}, ${p(0.55, 1.02)}, ${p(-0.05, 1)}`,
    `C ${p(-0.6, 0.98)}, ${p(-1, 0.6)}, ${p(-1, 0)}`,
    `C ${p(-1, -0.65)}, ${p(-0.5, -1.08)}, ${p(0.38, -0.86)}`,
  ].join(' ');
};

// Draws a hand-drawn ring around its content. The content is measured first, so the ring fits any text length.
const SketchRing = ({color, tilt = 0, children}: Props) => {
  const [size, setSize] = useState<{w: number; h: number} | null>(null);

  return (
    <View
      style={[styles.ring, {transform: [{rotate: `${tilt}deg`}]}]}
      onLayout={e => setSize({w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height})}
    >
      {size && (
        <Svg style={StyleSheet.absoluteFill} width={size.w} height={size.h}>
          <Path d={ringPath(size.w, size.h)} stroke={color} strokeWidth={2.4} strokeLinecap="round" fill="none" />
        </Svg>
      )}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  // Room for the ring around the content; the negative margins keep the surrounding layout as if there was no ring.
  ring: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    marginVertical: -5,
    marginHorizontal: -12,
  },
});

export default SketchRing;
