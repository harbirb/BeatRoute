import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

type Props = {
  children: React.ReactNode;
  initialX: number;
  initialY: number;
};

export const StickerWrapper: React.FC<Props> = ({
  children,
  initialX,
  initialY,
}) => {
  const oldX = useSharedValue(initialX);
  const oldY = useSharedValue(initialY);
  const translateX = useSharedValue(initialX);
  const translateY = useSharedValue(initialY);
  const scale = useSharedValue(0.4);
  const savedScale = useSharedValue(1);

  const panHandler = Gesture.Pan()
    .onStart(() => {
      oldX.value = translateX.value;
      oldY.value = translateY.value;
    })
    .onUpdate((event) => {
      translateX.value = oldX.value + event.translationX;
      translateY.value = oldY.value + event.translationY;
    });

  const pinchHandler = Gesture.Pinch()
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
    position: "absolute",
  }));

  const gesture = Gesture.Simultaneous(panHandler, pinchHandler);

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={animatedStyle}>{children}</Animated.View>
    </GestureDetector>
  );
};
