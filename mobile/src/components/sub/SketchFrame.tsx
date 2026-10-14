import {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Svg, {Path} from 'react-native-svg';

// A hand-drawn frame around its parent: four slightly crooked strokes, like drawn with a pen in four moves.
// Some corners overshoot, others leave a small gap. Place it as a child of the element to frame.
const SketchFrame = () => {
  const [size, setSize] = useState({width: 0, height: 0});
  const {width: w, height: h} = size;

  return (
    <View
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
      onLayout={e => setSize({width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height})}>
      {w > 0 && (
        <Svg width={w} height={h} fill="none" stroke="#26262b" strokeWidth={2.5} strokeLinecap="round">
          {/* top: stops short of the right corner */}
          <Path d={`M 5 3 C ${w * 0.35} 1.5, ${w * 0.65} 4, ${w - 7} 2.5`} />
          {/* right: runs past the bottom corner */}
          <Path d={`M ${w - 2.5} 5 C ${w - 1.5} ${h * 0.4}, ${w - 3.5} ${h * 0.7}, ${w - 2} ${h - 1.5}`} />
          {/* bottom: stops short of the left corner */}
          <Path d={`M ${w - 6} ${h - 3} C ${w * 0.6} ${h - 1.5}, ${w * 0.3} ${h - 4}, 7 ${h - 2.5}`} />
          {/* left: runs past the top corner */}
          <Path d={`M 2.5 ${h - 6} C 1.5 ${h * 0.6}, 3.5 ${h * 0.3}, 2 1.5`} />
        </Svg>
      )}
    </View>
  );
};

export default SketchFrame;
