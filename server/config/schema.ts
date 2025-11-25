import { pgTable, text, varchar, timestamp, boolean, numeric, primaryKey, unique, index, pgEnum,serial } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const lecture_type_enum = pgEnum('lecture_type', ['quiz', 'lesson']);
export const payment_method_enum = pgEnum('payment_method', ['razorpay', 'paypal']);

export const currency = pgTable('currency', {
  id: serial().primaryKey(),
  name: varchar().notNull().unique(),
  code: varchar().notNull().unique(),
});

export const category = pgTable('category', {
  id: serial().primaryKey(),
  name: varchar().notNull().unique(),
});

export const primary_languages = pgTable('primary_languages', {
  id: serial().primaryKey(),
  name: varchar().notNull().unique(),
});

export const course_levels = pgTable('course_levels', {
  id: serial().primaryKey(),
  name: varchar().notNull().unique(),
});
export const user = pgTable('user', {
  id: serial().primaryKey(),
  email: varchar().notNull().unique(),
  password: varchar().notNull(),
  is_instructor: boolean().default(false),
  created_at: timestamp().defaultNow(),
});

export const courses = pgTable(
  'courses',
  {
    id: serial().primaryKey(),
    title: varchar().notNull(),
    description: text().notNull(),
    pricing: numeric({ precision: 10, scale: 2 }).notNull(),
    welcomeMessage: text().notNull(),
    objectives: text().notNull(),
    image: varchar().notNull(),
    image_public_id: varchar().notNull(),
    is_published: boolean().default(true),
    currency_id: serial().references(() => currency.id),
    instructor_id: serial()
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    category_id: serial()
      .notNull()
      .references(() => category.id, { onDelete: 'set null' }),
    primary_language_id: serial()
      .notNull()
      .references(() => primary_languages.id, { onDelete: 'set null' }),
    course_level_id: serial()
      .notNull()
      .references(() => course_levels.id, { onDelete: 'set null' }),
    created_at: timestamp().defaultNow(),
    updated_at: timestamp().defaultNow(),
  },
  (table) => [
    index('instructor_id_idx').on(table.instructor_id),
  ]
);

export const modules = pgTable('modules', {
  id: serial().primaryKey(),
  course_id: serial()
    .notNull()
    .references(() => courses.id, { onDelete: 'cascade' }),
  name: varchar().notNull(),
  created_at: timestamp().defaultNow(),
});

export const lessons = pgTable('lessons', {
  id: serial().primaryKey(),
  module_id: serial()
    .notNull()
    .references(() => modules.id, { onDelete: 'cascade' }),
  name: varchar().notNull(),
  video_url: varchar({length: 500}),
  public_id: varchar(),
  lesson_description: text(),
  created_at: timestamp().defaultNow(),
});

export const enrollments = pgTable(
  'enrollments',
  {
    course_id: serial()
      .notNull()
      .references(() => courses.id, { onDelete: 'cascade' }),
    student_id: serial()
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    enrollment_date: timestamp().defaultNow(),
    completion_date: timestamp(),
    price: numeric({ precision: 10, scale: 2 }),
    currency_id: serial().references(() => currency.id),
  },
  (table) => [
    primaryKey({ columns: [table.course_id, table.student_id] }),
  ]
);

export const course_modules = pgTable(
  'course_modules',
  {
    id: serial().primaryKey(),
    course_id: serial()
      .notNull()
      .references(() => courses.id, { onDelete: 'cascade' }),
    module_id: serial()
      .notNull()
      .references(() => modules.id, { onDelete: 'cascade' }),
  },
  (table) => [
    unique('unique_course_module').on(table.course_id, table.module_id),
  ]
);

export const module_items = pgTable(
  'module_items',
  {
    id: serial().primaryKey(),
    module_id: serial()
      .notNull()
      .references(() => modules.id, { onDelete: 'cascade' }),
    item_id: serial().notNull(),
    lecture_type: lecture_type_enum().notNull(),
  },
  (table) => [
    unique('unique_module_item').on(table.module_id, table.item_id),
  ]
);

export const orders = pgTable('orders', {
  id: serial().primaryKey(),
  student_id: serial()
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  course_id: serial()
    .notNull()
    .references(() => courses.id, { onDelete: 'cascade' }),
  payment_method: payment_method_enum().notNull(),
  payment_status: varchar().notNull(),
  order_date: timestamp().defaultNow(),
  payment_id: varchar(),
  payer_id: varchar(),
});

export const student_lesson = pgTable(
  'student_lesson',
  {
    student_id: serial()
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    lesson_id: serial()
      .notNull()
      .references(() => lessons.id, { onDelete: 'cascade' }),
    completed_datetime: timestamp(),
  },
  (table) => [
    primaryKey({ columns: [table.student_id, table.lesson_id] }),
  ]
);

// Relations
export const currencyRelations = relations(currency, ({ many }) => ({
  courses: many(courses),
}));

export const userRelations = relations(user, ({ many }) => ({
  courses: many(courses),
  enrollments: many(enrollments),
  orders: many(orders),
  studentLessons: many(student_lesson),
}));

export const courseRelations = relations(courses, ({ one, many }) => ({
  instructor: one(user, {
    fields: [courses.instructor_id],
    references: [user.id],
  }),
  currency: one(currency),
  modules: many(modules),
  enrollments: many(enrollments),
  orders: many(orders),
  category: many(category),
  level: many(course_levels),
  primaryLanguage: many(primary_languages),
}));

export const modulesRelations = relations(modules, ({ one, many }) => ({
  course: one(courses),
  lessons: many(lessons),
}));

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  module: one(modules),
  studentLessons: many(student_lesson),
}));

export const enrollmentRelations = relations(enrollments, ({ one }) => ({
  course: one(courses),
  student: one(user, {
    fields: [enrollments.student_id],
    references: [user.id],
  }),
  currency: one(currency),
}));

export const orderRelations = relations(orders, ({ one }) => ({
  student: one(user, {
    fields: [orders.student_id],
    references: [user.id],
  }),
  course: one(courses),
}));

export const studentLessonRelations = relations(student_lesson, ({ one }) => ({
  student: one(user, {
    fields: [student_lesson.student_id],
    references: [user.id],
  }),
  lesson: one(lessons),
}));