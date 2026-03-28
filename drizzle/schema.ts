import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  boolean,
  json,
  double,
  datetime,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extended with additional fields for the Oriana Staff system.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Branches table - تخزين الفروع المختلفة للشركة
 */
export const branches = mysqlTable("branches", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  address: text("address"),
  latitude: double("latitude"),
  longitude: double("longitude"),
  radius: int("radius").default(100), // نطاق العمل بالمتر
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Branch = typeof branches.$inferSelect;
export type InsertBranch = typeof branches.$inferInsert;

/**
 * Departments table - تخزين الأقسام
 */
export const departments = mysqlTable("departments", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  branchId: int("branchId").notNull(),
  description: text("description"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Department = typeof departments.$inferSelect;
export type InsertDepartment = typeof departments.$inferInsert;

/**
 * Shifts table - تخزين الورديات
 */
export const shifts = mysqlTable("shifts", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(), // صباحي، مسائي، ليلي
  startTime: varchar("startTime", { length: 5 }).notNull(), // HH:MM
  endTime: varchar("endTime", { length: 5 }).notNull(), // HH:MM
  branchId: int("branchId").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Shift = typeof shifts.$inferSelect;
export type InsertShift = typeof shifts.$inferInsert;

/**
 * Employees table - تخزين بيانات الموظفين
 */
export const employees = mysqlTable("employees", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  firstName: varchar("firstName", { length: 255 }).notNull(),
  lastName: varchar("lastName", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).unique(),
  phone: varchar("phone", { length: 20 }),
  nationalId: varchar("nationalId", { length: 50 }).unique(),
  branchId: int("branchId").notNull(),
  departmentId: int("departmentId").notNull(),
  shiftId: int("shiftId").notNull(),
  baseSalary: decimal("baseSalary", { precision: 10, scale: 2 }).notNull(),
  hourlyRate: decimal("hourlyRate", { precision: 10, scale: 2 }),
  profileImage: text("profileImage"), // URL للصورة
  isActive: boolean("isActive").default(true).notNull(),
  joinDate: timestamp("joinDate").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Employee = typeof employees.$inferSelect;
export type InsertEmployee = typeof employees.$inferInsert;

/**
 * Attendance Records table - تخزين سجلات الحضور والانصراف
 */
export const attendanceRecords = mysqlTable("attendance_records", {
  id: int("id").autoincrement().primaryKey(),
  employeeId: int("employeeId").notNull(),
  checkInTime: timestamp("checkInTime"),
  checkOutTime: timestamp("checkOutTime"),
  checkInLatitude: double("checkInLatitude"),
  checkInLongitude: double("checkInLongitude"),
  checkOutLatitude: double("checkOutLatitude"),
  checkOutLongitude: double("checkOutLongitude"),
  checkInImage: text("checkInImage"), // URL للصورة
  checkOutImage: text("checkOutImage"), // URL للصورة
  workHours: decimal("workHours", { precision: 5, scale: 2 }), // عدد ساعات العمل
  status: mysqlEnum("status", ["present", "absent", "late", "early_leave", "half_day"]).default("present"),
  notes: text("notes"),
  isVerified: boolean("isVerified").default(false), // التحقق من عدم التلاعب
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AttendanceRecord = typeof attendanceRecords.$inferSelect;
export type InsertAttendanceRecord = typeof attendanceRecords.$inferInsert;

/**
 * GPS Tracks table - تخزين مسارات GPS
 */
export const gpsTracks = mysqlTable("gps_tracks", {
  id: int("id").autoincrement().primaryKey(),
  employeeId: int("employeeId").notNull(),
  attendanceRecordId: int("attendanceRecordId"),
  latitude: double("latitude").notNull(),
  longitude: double("longitude").notNull(),
  accuracy: double("accuracy"), // دقة الموقع
  speed: double("speed"), // السرعة
  timestamp: timestamp("timestamp", { mode: "date" }).defaultNow().notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
});

export type GpsTrack = typeof gpsTracks.$inferSelect;
export type InsertGpsTrack = typeof gpsTracks.$inferInsert;

/**
 * Payroll Records table - تخزين سجلات الرواتب
 */
export const payrollRecords = mysqlTable("payroll_records", {
  id: int("id").autoincrement().primaryKey(),
  employeeId: int("employeeId").notNull(),
  month: varchar("month", { length: 7 }).notNull(), // YYYY-MM
  baseSalary: decimal("baseSalary", { precision: 10, scale: 2 }).notNull(),
  overtimeHours: decimal("overtimeHours", { precision: 5, scale: 2 }).default("0"),
  overtimePay: decimal("overtimePay", { precision: 10, scale: 2 }).default("0"),
  bonuses: decimal("bonuses", { precision: 10, scale: 2 }).default("0"),
  deductions: decimal("deductions", { precision: 10, scale: 2 }).default("0"),
  totalPay: decimal("totalPay", { precision: 10, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["draft", "approved", "paid"]).default("draft"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PayrollRecord = typeof payrollRecords.$inferSelect;
export type InsertPayrollRecord = typeof payrollRecords.$inferInsert;

/**
 * Leaves table - تخزين الإجازات
 */
export const leaves = mysqlTable("leaves", {
  id: int("id").autoincrement().primaryKey(),
  employeeId: int("employeeId").notNull(),
  leaveType: mysqlEnum("leaveType", ["annual", "sick", "unpaid", "maternity"]).notNull(),
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate").notNull(),
  days: int("days").notNull(),
  reason: text("reason"),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending"),
  approvedBy: int("approvedBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Leave = typeof leaves.$inferSelect;
export type InsertLeave = typeof leaves.$inferInsert;

/**
 * Device Tokens table - لتخزين معرفات الأجهزة للتحقق من التلاعب بالوقت
 */
export const deviceTokens = mysqlTable("device_tokens", {
  id: int("id").autoincrement().primaryKey(),
  employeeId: int("employeeId").notNull(),
  deviceId: varchar("deviceId", { length: 255 }).notNull(),
  deviceName: varchar("deviceName", { length: 255 }),
  osType: varchar("osType", { length: 50 }), // iOS, Android
  lastServerTime: timestamp("lastServerTime"), // آخر وقت تم التحقق منه من الخادم
  lastDeviceTime: timestamp("lastDeviceTime"), // آخر وقت على الجهاز
  timeDifference: int("timeDifference").default(0), // الفرق بالثواني
  isValid: boolean("isValid").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DeviceToken = typeof deviceTokens.$inferSelect;
export type InsertDeviceToken = typeof deviceTokens.$inferInsert;

/**
 * System Logs table - تسجيل الأنشطة المهمة
 */
export const systemLogs = mysqlTable("system_logs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  action: varchar("action", { length: 255 }).notNull(),
  entityType: varchar("entityType", { length: 100 }),
  entityId: int("entityId"),
  details: json("details"),
  ipAddress: varchar("ipAddress", { length: 45 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SystemLog = typeof systemLogs.$inferSelect;
export type InsertSystemLog = typeof systemLogs.$inferInsert;


/**
 * Notifications table for storing system notifications
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  employeeId: int("employeeId"),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  type: mysqlEnum("type", ["attendance", "warning", "salary", "leave", "system", "gps_alert", "buddy_punch"]).default("system").notNull(),
  isRead: boolean("isRead").default(false).notNull(),
  readAt: timestamp("readAt"),
  relatedId: int("relatedId"),
  relatedType: varchar("relatedType", { length: 50 }),
  data: text("data"),
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
  attendanceNotifications: boolean("attendanceNotifications").default(true).notNull(),
  warningNotifications: boolean("warningNotifications").default(true).notNull(),
  salaryNotifications: boolean("salaryNotifications").default(true).notNull(),
  leaveNotifications: boolean("leaveNotifications").default(true).notNull(),
  gpsAlertNotifications: boolean("gpsAlertNotifications").default(true).notNull(),
  inAppNotifications: boolean("inAppNotifications").default(true).notNull(),
  emailNotifications: boolean("emailNotifications").default(false).notNull(),
  smsNotifications: boolean("smsNotifications").default(false).notNull(),
  pushNotifications: boolean("pushNotifications").default(true).notNull(),
  quietHoursEnabled: boolean("quietHoursEnabled").default(false).notNull(),
  quietHoursStart: varchar("quietHoursStart", { length: 5 }),
  quietHoursEnd: varchar("quietHoursEnd", { length: 5 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type NotificationPreference = typeof notificationPreferences.$inferSelect;
export type InsertNotificationPreference = typeof notificationPreferences.$inferInsert;
