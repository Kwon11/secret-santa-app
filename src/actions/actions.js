export const ITEM_SEARCH = 'ITEM_SEARCH';
//pass as little data as possible in each action -- redux docs

export function itemSearch (keywords) {
  if (keywords) {
    return {
      type: ITEM_SEARCH,
      query: keywords
    }
  } else {
    return {
      type: 'NULL_SEARCH'
    }
  }
};