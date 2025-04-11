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
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const panHandler = Gesture.Pan().onUpdate((event) => {
    translateX.value = initialX + event.translationX;
    translateY.value = initialY + event.translationY;
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
    backgroundColor: "teal",
  }));

  return (
    <GestureDetector gesture={panHandler}>
      <Animated.View style={animatedStyle}>{children}</Animated.View>
    </GestureDetector>
  );
};
