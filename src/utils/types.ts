export type ElementParams = Record<string, string | number>;

export interface CarObject {
  name?: string;
  color?: string;
  readonly id?: number;
  velocity?: number;
  distance?: number;
  success?: boolean;
  wins?: number;
  time?: number;
  finishTime?: number;
}

export interface FunctionArguments {
  id?: number;
  needRender?: RenderObject;
  name?: string;
  color?: string;
  index?: number;
  selector?: HTMLElement;
  page?: string;
  elementsPerPage?: number;
  pageNumber?: number;
  success?: boolean;
  velocity?: number;
  seconds?: number;
  startTime?: number;
}

export interface RenderObject {
  key: boolean;
  sortedParam?: string;
  direction?: string;
}

export interface Route {
  path: string;
  component: string;
}

export interface ResponseObject {
  color?: string;
  name?: string;
  id?: number;
}
