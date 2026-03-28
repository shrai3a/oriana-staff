import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getDb, logSystemActivity } from "./db";
import {
  employees,
  branches,
  departments,
  shifts,
  attendanceRecords,
  gpsTracks,
  payrollRecords,
  leaves,
  deviceTokens,
  notifications,
  notificationPreferences,
} from "../drizzle/schema";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import { notificationsRouter } from "./routers_notifications";

export const appRouter = router({
  system: systemRouter,
  notifications: notificationsRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ============= Branches Router =============
  branches: router({
    list: protectedProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(branches).where(eq(branches.isActive, true));
    }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return null;
        const result = await db
          .select()
          .from(branches)
          .where(eq(branches.id, input.id))
          .limit(1);
        return result.length > 0 ? result[0] : null;
      }),

    create: protectedProcedure
      .input(
        z.object({
          name: z.string(),
          address: z.string().optional(),
          latitude: z.number().optional(),
          longitude: z.number().optional(),
          radius: z.number().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const result = await db.insert(branches).values(input);
        await logSystemActivity(
          ctx.user?.id,
          "CREATE_BRANCH",
          "branch",
          undefined,
          input,
          ctx.req.ip
        );
        return result;
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          address: z.string().optional(),
          latitude: z.number().optional(),
          longitude: z.number().optional(),
          radius: z.number().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const { id, ...updateData } = input;
        await db.update(branches).set(updateData).where(eq(branches.id, id));
        await logSystemActivity(
          ctx.user?.id,
          "UPDATE_BRANCH",
          "branch",
          id,
          updateData,
          ctx.req.ip
        );
        return { success: true };
      }),
  }),

  // ============= Employees Router =============
  employees: router({
    list: protectedProcedure
      .input(z.object({ branchId: z.number().optional() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];

        if (input.branchId) {
          return await db
            .select()
            .from(employees)
            .where(
              and(
                eq(employees.branchId, input.branchId),
                eq(employees.isActive, true)
              )
            );
        }
        return await db
          .select()
          .from(employees)
          .where(eq(employees.isActive, true));
      }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return null;
        const result = await db
          .select()
          .from(employees)
          .where(eq(employees.id, input.id))
          .limit(1);
        return result.length > 0 ? result[0] : null;
      }),

    create: protectedProcedure
      .input(
        z.object({
          firstName: z.string(),
          lastName: z.string(),
          email: z.string().email().optional(),
          phone: z.string().optional(),
          nationalId: z.string().optional(),
          branchId: z.number(),
          departmentId: z.number(),
          shiftId: z.number(),
          baseSalary: z.string(),
          hourlyRate: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const result = await db.insert(employees).values(input);
        await logSystemActivity(
          ctx.user?.id,
          "CREATE_EMPLOYEE",
          "employee",
          undefined,
          input,
          ctx.req.ip
        );
        return result;
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          firstName: z.string().optional(),
          lastName: z.string().optional(),
          email: z.string().email().optional(),
          phone: z.string().optional(),
          branchId: z.number().optional(),
          departmentId: z.number().optional(),
          shiftId: z.number().optional(),
          baseSalary: z.string().optional(),
          hourlyRate: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const { id, ...updateData } = input;
        await db.update(employees).set(updateData).where(eq(employees.id, id));
        await logSystemActivity(
          ctx.user?.id,
          "UPDATE_EMPLOYEE",
          "employee",
          id,
          updateData,
          ctx.req.ip
        );
        return { success: true };
      }),
  }),

  // ============= Departments Router =============
  departments: router({
    list: protectedProcedure
      .input(z.object({ branchId: z.number() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];
        return await db
          .select()
          .from(departments)
          .where(
            and(
              eq(departments.branchId, input.branchId),
              eq(departments.isActive, true)
            )
          );
      }),

    create: protectedProcedure
      .input(
        z.object({
          name: z.string(),
          branchId: z.number(),
          description: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const result = await db.insert(departments).values(input);
        await logSystemActivity(
          ctx.user?.id,
          "CREATE_DEPARTMENT",
          "department",
          undefined,
          input,
          ctx.req.ip
        );
        return result;
      }),
  }),

  // ============= Shifts Router =============
  shifts: router({
    list: protectedProcedure
      .input(z.object({ branchId: z.number() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];
        return await db
          .select()
          .from(shifts)
          .where(
            and(eq(shifts.branchId, input.branchId), eq(shifts.isActive, true))
          );
      }),

    create: protectedProcedure
      .input(
        z.object({
          name: z.string(),
          startTime: z.string(),
          endTime: z.string(),
          branchId: z.number(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const result = await db.insert(shifts).values(input);
        await logSystemActivity(
          ctx.user?.id,
          "CREATE_SHIFT",
          "shift",
          undefined,
          input,
          ctx.req.ip
        );
        return result;
      }),
  }),

  // ============= Attendance Router =============
  attendance: router({
    getTodayRecord: protectedProcedure
      .input(z.object({ employeeId: z.number() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return null;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const result = await db
          .select()
          .from(attendanceRecords)
          .where(
            and(
              eq(attendanceRecords.employeeId, input.employeeId),
              gte(attendanceRecords.createdAt, today),
              lte(attendanceRecords.createdAt, tomorrow)
            )
          )
          .limit(1);

        return result.length > 0 ? result[0] : null;
      }),

    getHistory: protectedProcedure
      .input(
        z.object({
          employeeId: z.number(),
          startDate: z.date(),
          endDate: z.date(),
        })
      )
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];

        return await db
          .select()
          .from(attendanceRecords)
          .where(
            and(
              eq(attendanceRecords.employeeId, input.employeeId),
              gte(attendanceRecords.createdAt, input.startDate),
              lte(attendanceRecords.createdAt, input.endDate)
            )
          )
          .orderBy(desc(attendanceRecords.createdAt));
      }),

    checkIn: protectedProcedure
      .input(
        z.object({
          employeeId: z.number(),
          latitude: z.number(),
          longitude: z.number(),
          checkInImage: z.string(),
          deviceId: z.string(),
          deviceTime: z.date(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const now = new Date();
        const timeDiff = Math.abs(now.getTime() - input.deviceTime.getTime());

        if (timeDiff > 60000) {
          throw new Error("Device time is not synchronized");
        }

        const result = await db.insert(attendanceRecords).values({
          employeeId: input.employeeId,
          checkInTime: now,
          checkInLatitude: input.latitude,
          checkInLongitude: input.longitude,
          checkInImage: input.checkInImage,
        });

        await logSystemActivity(
          ctx.user?.id,
          "CHECK_IN",
          "attendance",
          undefined,
          { employeeId: input.employeeId },
          ctx.req.ip
        );

        return result;
      }),

    checkOut: protectedProcedure
      .input(
        z.object({
          attendanceRecordId: z.number(),
          latitude: z.number(),
          longitude: z.number(),
          checkOutImage: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const now = new Date();

        await db
          .update(attendanceRecords)
          .set({
            checkOutTime: now,
            checkOutLatitude: input.latitude,
            checkOutLongitude: input.longitude,
            checkOutImage: input.checkOutImage,
          })
          .where(eq(attendanceRecords.id, input.attendanceRecordId));

        await logSystemActivity(
          ctx.user?.id,
          "CHECK_OUT",
          "attendance",
          input.attendanceRecordId,
          {},
          ctx.req.ip
        );

        return { success: true };
      }),
  }),

  // ============= GPS Tracks Router =============
  gpsTracks: router({
    getEmployeeTracks: protectedProcedure
      .input(
        z.object({
          employeeId: z.number(),
          startDate: z.date(),
          endDate: z.date(),
        })
      )
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];

        return await db
          .select()
          .from(gpsTracks)
          .where(
            and(
              eq(gpsTracks.employeeId, input.employeeId),
              gte(gpsTracks.timestamp, input.startDate),
              lte(gpsTracks.timestamp, input.endDate)
            )
          )
          .orderBy(gpsTracks.timestamp);
      }),

    addTrack: protectedProcedure
      .input(
        z.object({
          employeeId: z.number(),
          latitude: z.number(),
          longitude: z.number(),
          accuracy: z.number().optional(),
          speed: z.number().optional(),
          attendanceRecordId: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        await db.insert(gpsTracks).values(input);
        return { success: true };
      }),
  }),

  // ============= Payroll Router =============
  payroll: router({
    getEmployeePayroll: protectedProcedure
      .input(z.object({ employeeId: z.number(), month: z.string() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return null;

        const result = await db
          .select()
          .from(payrollRecords)
          .where(
            and(
              eq(payrollRecords.employeeId, input.employeeId),
              eq(payrollRecords.month, input.month)
            )
          )
          .limit(1);

        return result.length > 0 ? result[0] : null;
      }),

    getMonthPayrolls: protectedProcedure
      .input(z.object({ month: z.string() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];

        return await db
          .select()
          .from(payrollRecords)
          .where(eq(payrollRecords.month, input.month));
      }),

    create: protectedProcedure
      .input(
        z.object({
          employeeId: z.number(),
          month: z.string(),
          baseSalary: z.string(),
          overtimeHours: z.string().optional(),
          overtimePay: z.string().optional(),
          bonuses: z.string().optional(),
          deductions: z.string().optional(),
          totalPay: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const result = await db.insert(payrollRecords).values(input);
        await logSystemActivity(
          ctx.user?.id,
          "CREATE_PAYROLL",
          "payroll",
          undefined,
          input,
          ctx.req.ip
        );
        return result;
      }),
  }),

  // ============= Leaves Router =============
  leaves: router({
    getEmployeeLeaves: protectedProcedure
      .input(z.object({ employeeId: z.number() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];

        return await db
          .select()
          .from(leaves)
          .where(eq(leaves.employeeId, input.employeeId))
          .orderBy(desc(leaves.createdAt));
      }),

    create: protectedProcedure
      .input(
        z.object({
          employeeId: z.number(),
          leaveType: z.enum(["annual", "sick", "unpaid", "maternity"]),
          startDate: z.date(),
          endDate: z.date(),
          days: z.number(),
          reason: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const result = await db.insert(leaves).values(input);
        await logSystemActivity(
          ctx.user?.id,
          "CREATE_LEAVE",
          "leave",
          undefined,
          input,
          ctx.req.ip
        );
        return result;
      }),
  }),
});

export type AppRouter = typeof appRouter;
