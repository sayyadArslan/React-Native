import React, { useEffect } from 'react';
import { StyleSheet, LayoutChangeEvent } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import Svg, { Line, Circle, Path, Polyline } from 'react-native-svg';
import { Shape, DxfResult, arcPointsToLines } from '../utils/dxfLoader';
import { theme } from '../constants/theme';

interface Props {
  data: DxfResult;
  hiddenLayers: Set<string>;
  onViewportChange: (scale: number, tx: number, ty: number, size: { width: number; height: number }) => void;
  resetSignal: number;
  fitSignal: number;
}

export default function DxfCanvas({ data, hiddenLayers, onViewportChange, resetSignal, fitSignal }: Props) {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);
  const rotation = useSharedValue(0);
  const savedRotation = useSharedValue(0);
  const [canvasSize, setCanvasSize] = React.useState({ width: 1, height: 1 });

  const notifyViewport = () => {
    onViewportChange(scale.value, translateX.value, translateY.value, canvasSize);
  };

  useEffect(() => {
    scale.value = withTiming(1);
    translateX.value = withTiming(0);
    translateY.value = withTiming(0);
    rotation.value = withTiming(0);
    savedScale.value = 1;
    savedTranslateX.value = 0;
    savedTranslateY.value = 0;
    savedRotation.value = 0;
  }, [resetSignal]);

  useEffect(() => {
    // Fit to screen: center the drawing based on bbox
    const w = data.bbox.maxX - data.bbox.minX || 1;
    const h = data.bbox.maxY - data.bbox.minY || 1;
    const fitScale = Math.min(canvasSize.width / w, canvasSize.height / h) * 0.85;
    scale.value = withTiming(fitScale);
    translateX.value = withTiming(0);
    translateY.value = withTiming(0);
    savedScale.value = fitScale;
    savedTranslateX.value = 0;
    savedTranslateY.value = 0;
  }, [fitSignal]);

  const pan = Gesture.Pan().onUpdate((e) => {
    translateX.value = savedTranslateX.value + e.translationX;
    translateY.value = savedTranslateY.value + e.translationY;
  }).onEnd(() => {
    savedTranslateX.value = translateX.value;
    savedTranslateY.value = translateY.value;
    runOnJS(notifyViewport)();
  });

  const pinch = Gesture.Pinch().onUpdate((e) => {
    scale.value = Math.max(0.05, savedScale.value * e.scale);
  }).onEnd(() => {
    savedScale.value = scale.value;
    runOnJS(notifyViewport)();
  });

  const rotate = Gesture.Rotation().onUpdate((e) => {
    rotation.value = savedRotation.value + e.rotation;
  }).onEnd(() => {
    savedRotation.value = rotation.value;
  });

  const composed = Gesture.Simultaneous(pan, pinch, rotate);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
      { rotateZ: `${rotation.value}rad` },
    ],
  }));

  const centerX = (data.bbox.minX + data.bbox.maxX) / 2;
  const centerY = (data.bbox.minY + data.bbox.maxY) / 2;

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setCanvasSize({ width, height });
  };

  return (
    <GestureDetector gesture={composed}>
      <Animated.View style={[styles.container, animatedStyle]} onLayout={onLayout}>
        <Svg width="100%" height="100%" viewBox={`${centerX - 500} ${centerY - 500} 1000 1000`}>
          {data.shapes.map((s: Shape, i: number) => {
            if (hiddenLayers.has(s.layer)) return null;

            if (s.type === 'line') {
              return <Line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={theme.lime} strokeWidth={1} />;
            }
            if (s.type === 'circle') {
              return <Circle key={i} cx={s.cx} cy={s.cy} r={s.r} stroke={theme.lime} strokeWidth={1} fill="none" />;
            }
            if (s.type === 'arc') {
              const pts = arcPointsToLines(s.cx, s.cy, s.r, s.start, s.end);
              const d = pts.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
              return <Path key={i} d={d} stroke={theme.lime} strokeWidth={1} fill="none" />;
            }
            if (s.type === 'polyline') {
              const pointsStr = s.points.map((p) => `${p.x},${p.y}`).join(' ');
              return <Polyline key={i} points={pointsStr} stroke={theme.lime} strokeWidth={1} fill="none" />;
            }
            return null;
          })}
        </Svg>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
});