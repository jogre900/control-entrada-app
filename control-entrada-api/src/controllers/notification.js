import models from "@models";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Op, fn, col, literal } from "sequelize";
import moment from "moment";
import { $security, $serverPort } from "@config";
import { Expo } from "expo-server-sdk";
import fetch from "node-fetch";
const SECRETKEY = process.env.SECRETKEY || $security().secretKey;

const notificationType = {
  //SUSPENDED_EMPLOYEE = 'SUSPENDED_EMPLOYEE',
  ENTRY: "ENTRY",
  DEPARTURE: "DEPARTURE",
  CREATE_ZONE: "CREATE_ZONE",
  DELETE_ZONE: "DELETE_ZONE",
  CREATE_DESTINY: "CREATE_DESTINY",
  DELETE_DESTINY: "DELETE_DESTINY"
};

const notificationMessage = {
  ENTRY: "ha registrado una nueva entrada.",
  DEPARTURE: "ha registrado una nueva salida.",
  CREATE_ZONE: "ha creado una nueva zona.",
  DELETE_ZONE: "elimino una zona.",
  CREATE_DESTINY: "ha creado un nuevo destino.",
  DELETE_DESTINY: "elimino un destino."
};

//PRUEBA DE PUSH N
const expo = new Expo();

async function sendPushNotification(message) {
  // const message = {
  //   to: expoPushToken,
  //   sound: 'default',
  //   title: 'HOLA OMAIRA',
  //   body: 'And here is the body!',
  //   data: { someData: 'goes here' },
  // };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(message)
  });
}
//---------->
const sendPush = async messages => {
  // let messages = [];
  // messages.push({
  //   to: pushToken,
  //   sound: "default",
  //   body: "This is a test notification",
  //   data: { withSome: "data" }
  // });
  try {
    let resPush = await expo.sendPushNotificationsAsync(messages);
    return console.log("RES DE SENDP--", resPush);
    // NOTE: If a ticket contains an error code in ticket.details.error, you
    // must handle it appropriately. The error codes are listed in the Expo
    // documentation:
    // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
  } catch (error) {
    console.error(error);
  }
};

//FIN PRUEBA DE PUSH N

const notification = {
  notificationType: {
    //SUSPENDED_EMPLOYEE = 'SUSPENDED_EMPLOYEE',
    ENTRY: "ENTRY",
    DEPARTURE: "DEPARTURE",
    CREATE_ZONE: "CREATE_ZONE",
    DELETE_ZONE: "DELETE_ZONE",
    CREATE_DESTINY: "CREATE_DESTINY",
    DELETE_DESTINY: "DELETE_DESTINY"
  },

  notificationMessage: {
    ENTRY: "ha registrado una nueva entrada.",
    DEPARTURE: "ha registrado una nueva salida.",
    CREATE_ZONE: "ha creado una nueva zona.",
    DELETE_ZONE: "elimino una zona.",
    CREATE_DESTINY: "ha creado un nuevo destino.",
    DELETE_DESTINY: "elimino un destino."
  },

  //HELPER FOR CREATE NOTI
  createNotification: async function(
    userId,
    notification,
    notificationType,
    triggerId,
    targetId = null
  ) {
    // let message = {
    //   to: '',
    //   sound: 'default',
    //   title: 'HOLA OMAIRA',
    //   body: notification,
    //   data: { someData: 'goes here' },
    // };
   console.log("userid in create NOTI--",userId)
    try {
      const deviceToken = await models.Token.findAll({
        where: {
          userId
        }
      });
      console.log("deviceToken-",deviceToken)
      if (deviceToken) {
        let messages = [];
        deviceToken.map(token => {
          let message = {};
          message.to = token.dataValues.token;
          message.sound = "default";
          message.title = "Security";
          message.subtitle = "sub titulo";
          message.body = notification;
          message.data = { someData: "goes here" };
          (message.vibrate = [200, 200, 200]),
            (message.launchImageName =
              "https://i0.wp.com/paginadelespanol.com/wp-content/uploads/2019/06/Alguien-nadie-algo-nada-todo.png?fit=1080%2C1080&ssl=1");
          messages.push(message);
        });
        console.log("messages Array--", messages);

        const inputArray = userId.map((elem) => {
          let objectValues = {}
          objectValues.notification = notification
          objectValues.notificationType = notificationType,
          objectValues.triggerId = triggerId
          objectValues.userId = elem
          objectValues.read = false
          return objectValues
        })
        console.log("inputArray--", inputArray)

        const newNoti = await models.Notification.bulkCreate(inputArray);
        if (newNoti) {
          await sendPush(messages);
          return newNoti;
        }
      }
    } catch (error) {
      console.log(error);
    }
  },

  //FETCH ALL NOTIFICATION FROM ONE USER
  fetchAllNotification: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      tokn: null
    };
    
    const { userId, unread } = req.params;
    try {
      const noti = await models.Notification.findAll({
        where: {
          userId
        }
      });
      
      if (noti) {
      
        const triggerIdArray = noti.map(({dataValues}) => dataValues.triggerId)
        
        const userT = await models.User.findAll({
          where: {
            id: triggerIdArray
          },
          include: {
            model: models.Employee, as: 'Employee'
          }
        })
        const newArray = noti.map(({dataValues}) => {
          userT.map((elem) => {
            if(dataValues.triggerId === elem.dataValues.id){
              dataValues.nuevaKey = elem.dataValues.Employee
              return dataValues
            }
          })
        })
        console.log("NOTI NEW ARRAY--",newArray[0])
        if (unread) {
          let unreadArray = [];
          unreadArray = noti.filter(({ read }) => read === false);
          RESPONSE.error = false;
          RESPONSE.msg = "Busqueda exitosa!";
          RESPONSE.data = unreadArray;
          res.json(RESPONSE);
        } else {
          RESPONSE.error = false;
          RESPONSE.msg = "Busqueda exitosa!";
          RESPONSE.data = noti;
          res.json(RESPONSE);
          console.log(RESPONSE);
        }
      }
    } catch (error) {
      RESPONSE.msg = error.message;
      res.json(RESPONSE);
    }
  },
  //CHANGE READ STATUS
  changeToRead: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      tokn: null
    };
    const { id } = req.params;
    let arrayIds = [];
    if (id.length > 36) {
      arrayIds = id.split(",");
    }
    try {
      const noti = await models.Notification.findAll({
        where: {
          id: arrayIds.length ? arrayIds.length : id
        },
        include: {
          model: models.User,
          as: "User",
          include: {
            model: models.Employee,
            as: "Employee"
          }
        }
      });
      noti.map(elem => {
        elem.read = true;
        elem.save();
      });
      RESPONSE.error = false;
      RESPONSE.msg = "Actualizacion exitosa!";
      RESPONSE.data = noti;
      res.json(RESPONSE);
    } catch (error) {
      RESPONSE.msg = error.message;
      res.json(RESPONSE);
    }
  }
};

export default notification;
