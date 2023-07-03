import { createReducer, on } from '@ngrx/store';
import { addStep, undo, redo } from './flowchart.actions';

export interface FlowchartState {
  current: any;
  past: any[];
  future: any[];
}

export interface AppState {
  flowchart: FlowchartState;
}

export const initialState: FlowchartState = {
  current: null,
  past: [],
  future: []
};

export const flowchartReducer = createReducer(
  initialState,
  on(addStep, (state: any, { step }) => {
    return {
      past: [...state.past, state.current],
      current: step,
      future: []
    };
  }),
  on(undo, (state: any) => {
    if (state.past.length === 0) {
      return state;
    }
    return {
      past: state.past.slice(0, state.past.length - 1),
      current: state.past[state.past.length - 1],
      future: [state.current, ...state.future]
    };
  }),
  on(redo, (state: any) => {
    if (state.future.length === 0) {
      return state;
    }
    return {
      past: [...state.past, state.current],
      current: state.future[0],
      future: state.future.slice(1)
    };
  }),
);
