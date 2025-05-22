import { View } from "react-native";

const Decoration = ({radius, color, top, left, opacity=0.08 })=> {
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
      
