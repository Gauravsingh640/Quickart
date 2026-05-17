import {
  Order,
} from "../models/orderModel.js";

import {
  sendOrderMail,
} from "../utils/sendOrderMail.js";

import { User }
from "../models/userModel.js";
 
import {
  Product,
} from "../models/productModel.js";


import {
  customAlphabet,
} from "nanoid";


const generateCode = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 6);



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

      address,

    } = req.body;

    console.log(
      address.email
    );
    console.log(items);
    console.log(address);
    
    // FORMAT ITEMS

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

    console.log(
      formattedItems
    );

    // CREATE ORDER
    const deliveryCode = generateCode();
    const order =

    await Order.create({

      user:req.id,

      items:
      formattedItems,

      totalPrice,

      status:
      status || "Pending",

      deliveryCode,
    }); 

    const user =
    await User.findById(
      req.id
    );

    // SEND TO LOGIN EMAIL
    if(status === "Pending"
){
      sendOrderMail(

        user.email,

        formattedItems,

        address,

        totalPrice,

        deliveryCode
      );

      // SEND TO CHECKOUT EMAIL
      // ONLY IF DIFFERENT
      
      if (
        address.email !==
        user.email
      ) {

        sendOrderMail(

          address.email,

          formattedItems,

          address,

          totalPrice,

          deliveryCode
        );
      }
    }

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


// GET SINGLE ORDER

export const getSingleOrder =
async (req,res) => {

  try {

    const order =

    await Order.findById(

      req.params.id
    )

    .populate("user");

    if(!order){

      return res.status(404)
      .json({

        success:false,

        message:
        "Order Not Found",
      });
    }

    return res.status(200)
    .json({

      success:true,

      order,
    });

  }

  catch(error){

    return res.status(500)
    .json({

      success:false,

      message:error.message,
    });
  }
};
 

// CONFIRM ORDER


export const confirmOrder =
async (req,res) => {

  try {

    const order =

    await Order.findById(

      req.params.id
    );

    if(!order){

      return res.status(404)
      .json({

        success:false,

        message:
        "Order Not Found",
      });
    }

    // CHECK STOCK

    for(

      const item
      of
      order.items

    ){

      const product =

      await Product.findById(

        item.id
      );

      if(

        item.quantity
        >
        product.stock

      ){

        order.status =
        "Cancelled";

        await order.save();

        return res.status(400)
        .json({

          success:false,

          message:
          `${item.title} Out Of Stock`,
        });
      }
    }

    // REDUCE STOCK

    for(

      const item
      of
      order.items

    ){

      const product =

      await Product.findById(

        item.id
      );

      product.stock -=
      item.quantity;

      await product.save();
    }

    // CONFIRM ORDER

    order.status =
    "Confirmed";

    await order.save();

    return res.status(200)
    .json({

      success:true,

      message:
      "Order Confirmed",
    });

  }

  catch(error){

    return res.status(500)
    .json({

      success:false,

      message:error.message,
    });
  }
};


// CANCEL ORDER
 

export const cancelOrder =
async (req,res) => {

  try {

    const order =

    await Order.findById(

      req.params.id
    );

    if(!order){

      return res.status(404)
      .json({

        success:false,

        message:
        "Order Not Found",
      });
    }

    order.status =
    "Cancelled";

    await order.save();

    return res.status(200)
    .json({

      success:true,

      message:
      "Order Cancelled",
    });

  }

  catch(error){

    return res.status(500)
    .json({

      success:false,

      message:error.message,
    });
  }
};
