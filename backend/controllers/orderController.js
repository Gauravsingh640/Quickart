import {
  Order,
} from "../models/orderModel.js";


// CREATE ORDER

export const createOrder =
async (req, res) => {

  try {

    console.log("BODY:");
    console.log(req.body);

    console.log("REQ ID:");
    console.log(req.id);

    const {

      items,

      totalPrice,

      status,

    } = req.body;

    // FORMAT ITEMS
    console.log(items);
    const formattedItems =

    items.map((item) => ({

      id:
      item._id,

      title:
      item.name,

      image:

      item.images &&
      item.images.length > 0

      ?

      item.images[0].url

      :

      "",

      price:
      item.price,

      quantity:
      item.quantity,
    }));

    // CREATE ORDER

    const order =

    await Order.create({

      user:req.id,

      items:
      formattedItems,

      totalPrice,

      status:
      status || "Pending",
    });

    return res.status(201)
    .json({

      success:true,

      message:
      "Order placed successfully",

      order,
    });

  }

  catch(error){

    console.log(error);

    return res.status(500)
    .json({

      success:false,

      message:error.message,
    });
  }
};


// GET MY ORDERS

export const getMyOrders =
async (req, res) => {

  try {

    const orders =

    await Order.find({

      user:req.id,
    })

    .populate({

      path:"user",

      match:{
        isVerified:true,
      },
    })

    .sort({
      createdAt:-1,
    });

    // REMOVE NULL USER

    const filteredOrders =

    orders.filter(

      (order) => order.user
    );

    return res.status(200)
    .json({

      success:true,

      orders:
      filteredOrders,
    });

  }

  catch(error){

    console.log(error);

    return res.status(500)
    .json({

      success:false,

      message:error.message,
    });
  }
};


// GET USER ORDERS

export const getUserOrders =
async (req, res) => {

  try {

    const orders =

    await Order.find({

      user:req.params.id,
    })

    .populate({

      path:"user",

      match:{
        isVerified:true,
      },
    })

    .sort({
      createdAt:-1,
    });

    // REMOVE NULL USER

    const filteredOrders =

    orders.filter(

      (order) => order.user
    );

    return res.status(200)
    .json({

      success:true,

      orders:
      filteredOrders,
    });

  }

  catch(error){

    console.log(error);

    return res.status(500)
    .json({

      success:false,

      message:error.message,
    });
  }
};


// GET ALL ORDERS

export const getAllOrders =
async (req, res) => {

  try {

    const orders =

    await Order.find()

    .populate({

      path:"user",

      match:{
        isVerified:true,
      },
    })

    .sort({
      createdAt:-1,
    });

    // REMOVE NULL USERS

    const filteredOrders =

    orders.filter(

      (order) => order.user
    );

    return res.status(200)
    .json({

      success:true,

      orders:
      filteredOrders,
    });

  }

  catch(error){

    console.log(error);

    return res.status(500)
    .json({

      success:false,

      message:error.message,
    });
  }
};