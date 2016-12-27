/** 
 * Result
 */
export interface Result {
  percentage: number;
  boiler: Boiler;
}

/**
 * History
 */
export interface History {
  entries: Entry[];
  titles: string[];
  index: number;
  pairwise: Pairwise;
}
/**
 * Node
 */
export interface Node {
  name: string;
  subnodes?: Node[];
}
/**
 * Entry
 */
export interface Entry {
  x: number;
  y: number;
  factor: number;// this is the value of it
}

/**
 * Response
 */
export interface Response {
  code: number;
  message: string;
  data: any;
}

/**
 * Matrix
 */
export interface Matrix {
  n: number;
  matrix: number[];
}

/**
 * Pairwise
 */
export interface Pairwise {
  consistency: boolean;
  vector: number[];
}

/**
 * Filter
 */
export interface Filter {
  priceMore: number;
  powerMore: number;
  type: string;
}

/**
 * Dimension
 */
export interface Dimension {
  depth: number;
  width: number;
  height: number;
}

/**
 * Boiler
 */
export interface Boiler {
  model: string;
  brand: string;
  type: string;
  image: string;

  price: number;
  maintenance: number; // TODO add this to service layer
  power: number;
  area: number;
  safety: number;
  warranty: number;
  dimension: Dimension;
}

/**
 * Selection
 */
export interface Selection {
  square: number;
}