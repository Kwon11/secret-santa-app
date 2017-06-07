import { ITEM_SEARCH } from '../actions/actions.js';

export default function itemSearch (state = {}, action) {
  switch(action.type) {
    case ITEM_SEARCH:
      console.log('item_search activates');
      return 'searching';
    case 'ITEM_SEARCH_SUCCESS':
      console.log('reducer gets success', action.itemData.data.Items.Item);
      return action.itemData.data.Items.Item;
    default:
      return state;
  }
}
