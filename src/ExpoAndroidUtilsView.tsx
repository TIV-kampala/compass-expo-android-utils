import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { ExpoAndroidUtilsViewProps } from './ExpoAndroidUtils.types';

const NativeView: React.ComponentType<ExpoAndroidUtilsViewProps> =
  requireNativeViewManager('ExpoAndroidUtils');

export default function ExpoAndroidUtilsView(props: ExpoAndroidUtilsViewProps) {
  return <NativeView {...props} />;
}
