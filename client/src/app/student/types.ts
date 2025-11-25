export type Order = { 
  userId: number,
  orderStatus: 'pending',
  paymentMethod: string,
  paymentStatus: 'initiated',
  orderDate: Date,
  paymentId: string,
  payerId: string,
  instructorId: string,
  courseId: string,
  coursePricing: string,
}

export type BoughtCourseInfo = {
  "courseId": string,
  "instructorId": string,
  "dateOfPurchase": Date,
  "_id": string,
}

export type CourseProgress = {
  lectureId: string,
  viewed: boolean,
  dateViewed: Date,
  _id:string,
}