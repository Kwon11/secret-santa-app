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

export function itemClick (type, item, groupId, userId) {
  console.log('item getting clicked', type, item.ASIN);
  return {
    type: type,
    item_id: item.ASIN,
    group_id: groupId,
    user_id: userId
  }
}

export function assign (group_id) {
  console.log('func assign getting call', group_id);
  return {
    type: 'ASSIGN',
    group_id: group_id
  }
}