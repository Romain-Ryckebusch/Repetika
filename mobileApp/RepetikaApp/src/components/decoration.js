import { View } from "react-native";
import colors from "../styles/colors";

const Decoration = ({radius, color=colors.primary, top, left, opacity=0.05 })=> {
  return (
    <View
        style={{
        width: radius,
        height: radius,
        borderRadius: radius/2,
        backgroundColor: color,
        opacity: opacity,
        zIndex: 0,
        position: 'absolute',
        top: top,
        left: left,
        }}
    />
  );
};

export default Decoration;
      
