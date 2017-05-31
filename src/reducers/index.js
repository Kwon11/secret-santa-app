import { combineReducers } from 'redux'

const initialState = {
  activeUser: 'Liam Neesons',
  groups: {
    school: {
      memberList:["Stepanie Schertz", "Germaine Guider", "Noella Nigh", "Melaine Mortimore", "Myrtle Murray", "Regena Roby", "Wilford Weingartner", "Zita Zahm", "Aura Applewhite", "Janine Justice"],
      eventDetail: {
      },
      targetWish: {
        name: 'Tiger Woods',
        items: [1, 4, 2, 34,2 ,123 ,3]
      },
      userWish: {
        name: 'Liam Neesons',
        items: [24, 2463, 6234, 2364, 2344,,]
      },
      active: true
    },
    work: {
      memberList:["som awdss", "fewf sadf", "asdf awef", 'awef fewd', 'asdfj awe', 'waef efioh'],
      eventDetail: {

      },
      targetWish: {
        name: 'som awdss',
        items: [2, 42, 234, 4234, 23424]
      },
      userWish: {
        name: 'Liam Neesons',
        items: [23, 12, 432, 12]
      },
      active: true
    },
    church: {
      memberList:['steve kim', 'phil shin', 'kevin kim', 'paul chun', 'len kim'],
      eventDetail: {

      },
      targetWish: {
        name: 'paul chun',
        items: [2342, 234, 123412, 123]
      },
      userWish: {
        name: 'Liam Neesons',
        items: [7686, 678678, 678, 54]
      },
      active: true
    }
  }
};


const rootReducer = combineReducers({
  activeUser: ((state = null) => initialState.activeUser),
  groups: ((state = null) => initialState.groups)
})

export default rootReducer

