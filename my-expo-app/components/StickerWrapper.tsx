import { useState } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

type Props = {
  children: React.ReactNode;
  isSelected: boolean;
};

export const StickerWrapper: React.FC<Props> = ({ children, isSelected }) => {
  const oldX = useSharedValue(0);
  const oldY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(0.6);
  const savedScale = useSharedValue(1);

  const panHandler = Gesture.Pan()
    .enabled(isSelected)
    .onStart(() => {
      oldX.value = translateX.value;
      oldY.value = translateY.value;
    })
    .onUpdate((event) => {
      translateX.value = oldX.value + event.translationX;
      translateY.value = oldY.value + event.translationY;
    })
    .runOnJS(true);

  const pinchHandler = Gesture.Pinch()
    .enabled(isSelected)
    .onStart(() => {
      savedScale.value = scale.value;
    })
    .onUpdate((e) => {
      scale.value = savedScale.value * e.scale;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    borderWidth: 1,
    borderRadius: 18,
    borderColor: isSelected ? "red" : "transparent",
    position: "absolute",
  }));

  const gesture = Gesture.Simultaneous(panHandler, pinchHandler);

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={animatedStyle}>{children}</Animated.View>
    </GestureDetector>
  );
};
