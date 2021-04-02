import * as actionTypes from "../actions/actionTypes";

const initialState = {
  login: {
    token: "",
    userId: "",
    privilege: "",
  },
  profile: {
    id: "",
    dni: "",
    name: "",
    lastName: "",
    picture: "",
    email: "",
    userZone: []
  },
  company: [
    {
      id: "",
      companyName: "",
      businessName: "",
      nic: "",
      city: "",
      address: "",
      phoneNumber: "",
      phoneNumberOther: "",
      logo: "",
      privilege: "",
      select: false,
    },
  ],
  notificationNotRead : [],
  tutorial: false,
  deviceToken: ''
};

const companySelect = (state) => {
  return state.company.filter((c) => c.select == true)[0];
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case "SAVE_TOKEN":
    console.log("deviceToken",action.payload)  
    return {
        ...state,
        deviceToken: action.payload
      }
    case actionTypes.SET_LOGIN:
      return {
        ...state,
        login: action.payload,
        //company: companySelect(state),
      };
    case "SAVE_PROFILE":
    return {
        ...state,
        profile: action.payload
        //companySelect: companySelect(state),
      };
    case "SAVE_COMPANY":
      return {
        ...state,
        company: action.payload,
        //companySelect: companySelect(state),
      };
    case "setCompanySelect":
      let setComapny = state.company.map((c) => {
        if (c.id == action.payload) {
          c.select = true;
        } else {
          c.select = false;
        }
      });
      return {
        ...state,
        company: setComapny,
        companySelect: companySelect(state),
      };
    case "SAVE_PRIVILEGE":
      return {
        ...state,
        login: { ...state.login, privilege: action.payload },
        companySelect: companySelect(state),
      };
      case "SAVE_NOTI_NOT_READ":
        return {
          ...state,
          notificationNotRead: state.notificationNotRead.concat(action.payload)
        }
      case "TUTORIAL":
        return {
          ...state,
          tutorial: action.payload
        }
        case "TURN_OFF": 
        return {
            ...state,
            tutorial: action.payload
          }
      case "CLEAR_STORAGE":
      return {
        company: [],
        profile: {},
        login: {}
      };
    default:
      return state;
  }
};
