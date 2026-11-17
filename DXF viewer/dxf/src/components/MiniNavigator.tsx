import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Line, Circle } from 'react-native-svg';
import { Shape } from '../utils/dxfLoader';
import { theme } from '../constants/theme';

interface Props {
  shapes: Shape[];
  bbox: { minX: number; minY: number; maxX: number; maxY: number };
  scale: number;
  translateX: number;
  translateY: number;
  canvasSize: { width: number; height: number };
}

const NAV_SIZE = 90;

export default function MiniNavigator({ shapes, bbox, scale, translateX, translateY, canvasSize }: Props) {
  const w = bbox.maxX - bbox.minX || 1;
  const h = bbox.maxY - bbox.minY || 1;
  const navScale = Math.min(NAV_SIZE / w, NAV_SIZE / h);

  const toNav = (x: number, y: number) => ({
    x: (x - bbox.minX) * navScale,
    y: (y - bbox.minY) * navScale,
  });

  // approximate viewport rectangle in drawing space
  const viewW = canvasSize.width / scale;
  const viewH = canvasSize.height / scale;
  const viewX = bbox.minX + w / 2 - translateX / scale - viewW / 2;
  const viewY = bbox.minY + h / 2 - translateY / scale - viewH / 2;
  const vp1 = toNav(viewX, viewY);
  const vp2 = toNav(viewX + viewW, viewY + viewH);

  return (
    <View style={styles.box}>
      <Svg width={NAV_SIZE} height={NAV_SIZE}>
        <Rect x={0} y={0} width={NAV_SIZE} height={NAV_SIZE} fill="#000" />
        {shapes.slice(0, 300).map((s, i) => {
          if (s.type === 'line') {
            const p1 = toNav(s.x1, s.y1);
            const p2 = toNav(s.x2, s.y2);
            return <Line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={theme.lime} strokeWidth={0.5} />;
          }
          if (s.type === 'circle') {
            const c = toNav(s.cx, s.cy);
            return <Circle key={i} cx={c.x} cy={c.y} r={s.r * navScale} stroke={theme.lime} strokeWidth={0.5} fill="none" />;
          }
          return null;
        })}
        <Rect
          x={Math.min(vp1.x, vp2.x)}
          y={Math.min(vp1.y, vp2.y)}
          width={Math.abs(vp2.x - vp1.x)}
          height={Math.abs(vp2.y - vp1.y)}
          stroke="#ffffff"
          strokeWidth={1}
          fill="rgba(255,255,255,0.1)"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    position: 'absolute',
    bottom: 90,
    right: 16,
    width: NAV_SIZE,
    height: NAV_SIZE,
    borderWidth: 1,
    borderColor: theme.lime,
    borderRadius: 6,
    overflow: 'hidden',
  },
});