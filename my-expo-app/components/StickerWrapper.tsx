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
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const panHandler = Gesture.Pan()
    .onStart(() => {
      oldX.value = translateX.value;
      oldY.value = translateY.value;
    })
    .onUpdate((event) => {
      translateX.value = oldX.value + event.translationX;
      translateY.value = oldY.value + event.translationY;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <GestureDetector gesture={panHandler}>
      <Animated.View style={animatedStyle}>{children}</Animated.View>
    </GestureDetector>
  );
};
