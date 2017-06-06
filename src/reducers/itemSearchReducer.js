import { ITEM_SEARCH } from '../actions/actions.js';

export default function itemSearch (state = {}, action) {
  switch(action.type) {
    case ITEM_SEARCH:
      console.log('item_search activates');
      if (state) {
        return (
          {
              '1': 'lol',
              '2': 'asdfh',
              '3': 'a;wfijio',
              '4': 'nothing we do matters'
          }

        )
      }
    case 'ITEM_SEARCH_SUCCESS':
      console.log('reducer gets success', action)
      return state;
    default:
      return state;
  }
}
