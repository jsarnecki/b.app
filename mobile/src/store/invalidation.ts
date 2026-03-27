import { createAction } from '@reduxjs/toolkit';

export const invalidateTags = createAction<string[]>('cache/invalidateTags')
