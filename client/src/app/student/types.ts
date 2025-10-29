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