export default function groupsReducer(state='random string bitch', action) {
  // action.newList = {
  // 	group_id:
  // 	newList
  // }
	switch(action.type) {
    case 'NEW_WISHLIST':
      //right here we get at the state.groups.group_id.userlist 
      console.log('we got the newishlit item', action.newList);
      console.log('state here is', state);
      var newState = {...state};
      newState[action.group_id].userWishlist = action.newList.wishlist;
      console.log('newstate returning is', newState);
      return newState;
    default:
      return state;
	}
}