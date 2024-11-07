import { createSlice } from '@reduxjs/toolkit';

interface AnimationState {
  animation: boolean;
}

const initialState: AnimationState = {
  animation: true,
};

const animationSlice = createSlice({
  name: 'animation',
  initialState,
  reducers: {
    setAnimation: (state, action) => {
      state.animation = action.payload;
    },
  },
});

export const { setAnimation } = animationSlice.actions;
export default animationSlice.reducer;