export function activeUserIdReducer(state=5, action) {
  switch(action.type) {
    case 'LOGIN':
      console.log('activeId got login');
      return action.data.activeUserId
    default:
      return state; 
  }

}

export function activeUserNameReducer (state="liam neesons", action) {
  switch(action.type) {
    case 'LOGIN':
      console.log('activename got login');
      return action.data.activeUser;
    default:
      return state;
  }
}