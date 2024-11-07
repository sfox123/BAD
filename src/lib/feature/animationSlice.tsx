import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
    setAnimation: (state, action: PayloadAction<boolean>) => {
      state.animation = action.payload;
    },
    toggleAnimation: (state) => {
      state.animation = !state.animation;
    },
  },
});

export const { setAnimation, toggleAnimation } = animationSlice.actions;
export default animationSlice.reducer;