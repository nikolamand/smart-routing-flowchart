import { createAction, props } from '@ngrx/store';

export const addStep = createAction(
  '[Flowchart] Add Step',
  props<{ step: any }>()
);

export const undo = createAction(
  '[Flowchart] Undo Step'
);

export const redo = createAction(
  '[Flowchart] Redo Step'
);

export const stepUpdated = createAction(
  '[Flowchart] Step Updated'
);

