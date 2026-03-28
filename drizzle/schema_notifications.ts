import { int, mysqlTable, text, timestamp, varchar, boolean, mysqlEnum } from "drizzle-orm/mysql-core";

/**
 * Notifications table for storing system notifications
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  
  // Recipient information
  userId: int("userId").notNull(),
  employeeId: int("employeeId"),
  
  // Notification content
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  type: mysqlEnum("type", ["attendance", "warning", "salary", "leave", "system", "gps_alert", "buddy_punch"]).default("system").notNull(),
  
  // Notification status
  isRead: boolean("isRead").default(false).notNull(),
  readAt: timestamp("readAt"),
  
  // Related data
  relatedId: int("relatedId"),           // ID الموظف أو السجل المرتبط
  relatedType: varchar("relatedType", { length: 50 }), // نوع البيانات المرتبطة
  
  // Metadata
  data: text("data"),                    // JSON data for additional info
  
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

/**
 * Notification preferences table
 */
export const notificationPreferences = mysqlTable("notification_preferences", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  
  // Notification type preferences
  attendanceNotifications: boolean("attendanceNotifications").default(true).notNull(),
  warningNotifications: boolean("warningNotifications").default(true).notNull(),
  salaryNotifications: boolean("salaryNotifications").default(true).notNull(),
  leaveNotifications: boolean("leaveNotifications").default(true).notNull(),
  gpsAlertNotifications: boolean("gpsAlertNotifications").default(true).notNull(),
  
  // Notification method preferences
  inAppNotifications: boolean("inAppNotifications").default(true).notNull(),
  emailNotifications: boolean("emailNotifications").default(false).notNull(),
  smsNotifications: boolean("smsNotifications").default(false).notNull(),
  pushNotifications: boolean("pushNotifications").default(true).notNull(),
  
  // Quiet hours
  quietHoursEnabled: boolean("quietHoursEnabled").default(false).notNull(),
  quietHoursStart: varchar("quietHoursStart", { length: 5 }),  // HH:MM
  quietHoursEnd: varchar("quietHoursEnd", { length: 5 }),      // HH:MM
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type NotificationPreference = typeof notificationPreferences.$inferSelect;
export type InsertNotificationPreference = typeof notificationPreferences.$inferInsert;
