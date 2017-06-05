import { ITEM_SEARCH } from '../actions/actions.js';

const lala = {
  'eyyy': 'eyy',
  'lmano': 'asd'
}

export default function itemSearch (state = {}, action) {
  switch(action.type) {
    case ITEM_SEARCH:
      console.log('action.query is', action.query);
      console.log('state is', state);
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
    default:
      return state;
  }
}
