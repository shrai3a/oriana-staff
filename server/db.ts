import { eq, and, gte, lte, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  employees,
  branches,
  departments,
  shifts,
  attendanceRecords,
  gpsTracks,
  payrollRecords,
  leaves,
  deviceTokens,
  systemLogs,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============= Employees Functions =============

export async function getEmployeeById(employeeId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(employees)
    .where(eq(employees.id, employeeId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getEmployeesByBranch(branchId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(employees)
    .where(and(eq(employees.branchId, branchId), eq(employees.isActive, true)));
}

export async function getAllEmployees() {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(employees)
    .where(eq(employees.isActive, true));
}

// ============= Branches Functions =============

export async function getBranchById(branchId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(branches)
    .where(eq(branches.id, branchId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getAllBranches() {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(branches)
    .where(eq(branches.isActive, true));
}

// ============= Attendance Functions =============

export async function getTodayAttendance(employeeId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const result = await db
    .select()
    .from(attendanceRecords)
    .where(
      and(
        eq(attendanceRecords.employeeId, employeeId),
        gte(attendanceRecords.createdAt, today),
        lte(attendanceRecords.createdAt, tomorrow)
      )
    )
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getEmployeeAttendanceHistory(
  employeeId: number,
  startDate: Date,
  endDate: Date
) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(attendanceRecords)
    .where(
      and(
        eq(attendanceRecords.employeeId, employeeId),
        gte(attendanceRecords.createdAt, startDate),
        lte(attendanceRecords.createdAt, endDate)
      )
    )
    .orderBy(desc(attendanceRecords.createdAt));
}

// ============= GPS Tracks Functions =============

export async function getEmployeeGpsTracks(
  employeeId: number,
  startDate: Date,
  endDate: Date
) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(gpsTracks)
    .where(
      and(
        eq(gpsTracks.employeeId, employeeId),
        gte(gpsTracks.timestamp, startDate),
        lte(gpsTracks.timestamp, endDate)
      )
    )
    .orderBy(gpsTracks.timestamp);
}

// ============= Payroll Functions =============

export async function getEmployeePayroll(employeeId: number, month: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(payrollRecords)
    .where(
      and(
        eq(payrollRecords.employeeId, employeeId),
        eq(payrollRecords.month, month)
      )
    )
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getMonthPayrolls(month: string) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(payrollRecords)
    .where(eq(payrollRecords.month, month));
}

// ============= Shifts Functions =============

export async function getShiftById(shiftId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(shifts)
    .where(eq(shifts.id, shiftId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getBranchShifts(branchId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(shifts)
    .where(and(eq(shifts.branchId, branchId), eq(shifts.isActive, true)));
}

// ============= Departments Functions =============

export async function getDepartmentById(departmentId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(departments)
    .where(eq(departments.id, departmentId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getBranchDepartments(branchId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(departments)
    .where(and(eq(departments.branchId, branchId), eq(departments.isActive, true)));
}

// ============= Device Tokens Functions =============

export async function getDeviceToken(employeeId: number, deviceId: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(deviceTokens)
    .where(
      and(
        eq(deviceTokens.employeeId, employeeId),
        eq(deviceTokens.deviceId, deviceId)
      )
    )
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============= System Logs Functions =============

export async function logSystemActivity(
  userId: number | undefined,
  action: string,
  entityType: string | undefined,
  entityId: number | undefined,
  details: Record<string, unknown> | undefined,
  ipAddress: string | undefined
) {
  const db = await getDb();
  if (!db) return;

  try {
    await db.insert(systemLogs).values({
      userId,
      action,
      entityType,
      entityId,
      details: details ? JSON.stringify(details) : undefined,
      ipAddress,
    });
  } catch (error) {
    console.error("[Database] Failed to log system activity:", error);
  }
}
