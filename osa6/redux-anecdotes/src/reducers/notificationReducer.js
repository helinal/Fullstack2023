import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    setNotification(state, action) {
      console.log(state);
      console.log(action.payload);
      state = action.payload
      setTimeout(() => {
        state = null
      }, 5000)
    }
  }
})

export const { setNotification } = notificationSlice.actions
export default notificationSlice.reducer