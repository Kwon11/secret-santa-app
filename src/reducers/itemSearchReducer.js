import { ITEM_SEARCH } from '../actions/actions.js';

export default function itemSearch (state = null, action) {
  switch(action.type) {
    case ITEM_SEARCH:
      console.log('action.query is', action.query);
      console.log('state is', state);
      if (state) {
        return (
          {...state,
            searchResult: {
              '1': 'lol',
              '2': 'asdfh',
              '3': 'a;wfijio',
              '4': 'nothing we do matters'
            }
          }
        )
      }
      return state;
    default:
      return state;
  }
}
