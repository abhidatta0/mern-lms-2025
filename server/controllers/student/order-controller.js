
const Order = require('../../models/Orders');
const StudentCourses = require('../../models/StudentCourses');
const Course = require('../../models/Course');

// dummy order creation 
const createOrder = async (req, res) => {
  try {
    const {
        userId,
        orderStatus,
        paymentMethod,
        paymentStatus,
        orderDate,
        paymentId,
        payerId,
        instructorId,
        courseId,
        coursePricing,
    } = req.body;

    const random = Math.floor(Math.random()*(3)+1);  // between 1 and 3
    const isSuccess = await new Promise((res) => setTimeout(() => res(true), random * 1000));
    if(isSuccess){
      const newlyCreatedOrder = new Order({  
      userId,
      orderStatus,
      paymentMethod,
      paymentStatus,
      orderDate,
      paymentId,
      payerId,
      instructorId,
      courseId,
      coursePricing
      });
      await newlyCreatedOrder.save();
      res.status(201).json({
        success: true,
        message: "Order successful",
        data:{
          orderId: newlyCreatedOrder._id,
        }
      });
    }
  }catch(e){
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
}

const capturePaymentAndFinalizeOrder = async (req, res) => {
  try {
    const {paymentId, payerId, orderId} = req.body;
    let order = await Order.findOne({_id:orderId});

    console.log("in capturePaymentAndFinalizeOrder")

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order can not be found",
      });
    }

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = paymentId;
    order.payerId = payerId;

    await order.save();

     //update out student course model
    const studentCourses = await StudentCourses.findOne({
      userId: order.userId,
    });

    console.log({studentCourses});

    const studentCourseObject = {
      courseId: order.courseId,
      title: order.courseTitle,
      instructorId: order.instructorId,
      dateOfPurchase: order.orderDate,
    };

    // if student has already bought courses earlier push to the array , else add a new course 
    if (studentCourses) {
      studentCourses.courses.push(studentCourseObject);
      await studentCourses.save();
    }else{
      const newStudentCourse = new StudentCourses({
        userId: order.userId,
        courses: [
          studentCourseObject
        ],
      });

      await newStudentCourse.save();
    }

    //update the course schema students
    await Course.findByIdAndUpdate(order.courseId, {
      $addToSet: {
        students: {
          studentId: order.userId,
          paidAmount: order.coursePricing,
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Order confirmed",
      data: order,
    });
  }catch(e){
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
}
module.exports = {createOrder,capturePaymentAndFinalizeOrder}