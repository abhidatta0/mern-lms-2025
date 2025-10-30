export type Order = { 
  userId: string,
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