const IOS_BACK_EDGE_WIDTH = 24;
const IOS_BACK_CAPTURE_DISTANCE = 12;
const IOS_BACK_COMPLETE_DISTANCE = 72;
const IOS_BACK_MIN_VELOCITY = 0.05;
const HORIZONTAL_INTENT_RATIO = 1.5;

export interface BackGestureMetrics {
  dx: number;
  dy: number;
  moveX: number;
  vx: number;
}

function startedAtLeftEdge({ dx, moveX }: BackGestureMetrics) {
  return moveX - dx <= IOS_BACK_EDGE_WIDTH;
}

function hasHorizontalIntent({ dx, dy }: BackGestureMetrics) {
  return dx > 0 && Math.abs(dx) > Math.abs(dy) * HORIZONTAL_INTENT_RATIO;
}

export const shouldCaptureIosBackGesture = (metrics: BackGestureMetrics) =>
  startedAtLeftEdge(metrics) &&
  hasHorizontalIntent(metrics) &&
  metrics.dx >= IOS_BACK_CAPTURE_DISTANCE;

export const shouldCompleteIosBackGesture = (metrics: BackGestureMetrics) =>
  shouldCaptureIosBackGesture(metrics) &&
  metrics.dx >= IOS_BACK_COMPLETE_DISTANCE &&
  metrics.vx >= IOS_BACK_MIN_VELOCITY;
