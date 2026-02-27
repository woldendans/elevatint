export const displayModes = ['Hillshade', 'Continuous', 'Bands'] as const;
export type DisplayMode = (typeof displayModes)[number];
