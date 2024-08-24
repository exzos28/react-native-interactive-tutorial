type AdditionalLayout = {
  borderRadius?: number;
};

export type Layout = AdditionalLayout & {
  x: number;
  y: number;
  width: number;
  height: number;
  pageX: number;
  pageY: number;
};

export type UiElement = {
  measure: () => Promise<Layout | null>;
  layout: Layout | null;
};

export type Target = {
  element: UiElement;
  name: Name;
};

export type Name = string | number;

export type Translations = {
  prevButton: string;
  nextButton: string;
  finishButton: string;
};
