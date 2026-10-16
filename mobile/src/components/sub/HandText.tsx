import {Text, TextProps} from 'react-native';

type Props = TextProps & {
  weight?: 'bold' | 'medium';
};

// Handwriting text in Caveat. Android measures Caveat a little too narrow and cuts off the right edge
// of the last letter, so a non-breaking space at the end makes the text box wide enough for it.
const HandText = ({weight = 'bold', style, children, ...rest}: Props) => (
  <Text style={[{fontFamily: weight === 'bold' ? 'Caveat_700Bold' : 'Caveat_500Medium'}, style]} {...rest}>
    {children}{' '}
  </Text>
);

export default HandText;
