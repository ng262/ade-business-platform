import { z } from "zod";
import { Role, AttendanceStatus, Status, Side } from "./types/domain.types";
import { format } from "date-fns";

const _ = {
  serialId: z.coerce.number().int().positive(),
  date: z.preprocess(
    (val) => {
      if (typeof val === "string" || val instanceof Date) {
        const parsed = new Date(val);
        if (isNaN(parsed.getTime())) return undefined;
        return format(parsed, "yyyy-MM-dd");
      }
      return undefined;
    },
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
  ),
  fname: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be 50 characters or fewer"),
  lname: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must be 50 characters or fewer"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores allowed"),
  email: z.string().email(),
  phone: z
    .string()
    .regex(/^(\+0?1\s?)?(\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}|\d{10})$/, {
      message: "Invalid phone number format",
    }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    )
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter"),
  role: z.nativeEnum(Role, {
    errorMap: () => ({ message: "Role is required" }),
  }),
  side: z.nativeEnum(Side, {
    errorMap: () => ({ message: "Side is required" }),
  }),
  attendance_status: z.nativeEnum(AttendanceStatus),
  status: z.nativeEnum(Status, {
    errorMap: () => ({ message: "Status is required" }),
  }),
  document: z
    .instanceof(File)
    .refine((file) => file.size > 0, "File is required")
    .refine((file) => file.size < 5 * 1024 * 1024, "File must be under 5MB")
    .refine(
      (file) =>
        [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(file.type),
      "Only PDF, DOC, or DOCX files are allowed"
    ),
} as const;

export const contactSchema = z.object({
  fname: _.fname,
  lname: _.lname,
  email: _.email,
  phone: _.phone,
  message: z
    .string()
    .min(10, "Message is too short")
    .max(1000, "Message is too long"),
});
export type Contact = z.infer<typeof contactSchema>;

export const applicationSchema = z.object({
  fname: _.fname,
  lname: _.lname,
  email: _.email,
  phone: _.phone,
  message: z.string(),
});
export type Application = z.infer<typeof applicationSchema>;

export const applicationFilesSchema = z.object({
  files: z.array(_.document).min(1, "At least one document must be uploaded"),
});

export const lookupsSchema = z.object({
  role: _.role,
  side: _.side,
  attendance_status: _.attendance_status,
  status: _.status,
});
export type Lookups = z.infer<typeof lookupsSchema>;

export const usernameSchema = z.object({ username: _.username });
export type Username = z.infer<typeof usernameSchema>;

export const serialIdSchema = _.serialId;
export type SerialId = z.infer<typeof serialIdSchema>;

export const serialIdListSchema = z.object({ ids: z.array(_.serialId) });
export type SerialIdList = z.infer<typeof serialIdListSchema>;

export const deleteUsersSchema = z.array(
  z.object({
    id: _.serialId,
    username: _.username,
  })
);
export type DeleteUsers = z.infer<typeof deleteUsersSchema>;

export const credentialsSchema = z.object({
  username: _.username,
  password: _.password,
});
export type Credentials = z.infer<typeof credentialsSchema>;

export const challengeSchema = z.object({
  challenge: z.string(),
  session: z.string(),
  username: _.username,
});
export type Challenge = z.infer<typeof challengeSchema>;

export const completeChallengeSchema = z.object({
  username: _.username,
  newPassword: _.password,
  session: z.string(),
});
export type CompleteChallenge = z.infer<typeof completeChallengeSchema>;

export const userSchema = z.object({
  id: _.serialId,
  fname: _.fname,
  lname: _.lname,
  username: _.username,
  side: _.side,
  role: _.role,
  status: _.status,
});
export type User = z.infer<typeof userSchema>;

export const loginResultSchema = userSchema.or(challengeSchema);
export type LoginResult = z.infer<typeof loginResultSchema>;

export const userDataSchema = userSchema.omit({ id: true });
export type UserData = z.infer<typeof userDataSchema>;

export const userListSchema = z.array(userSchema);
export type UserList = z.infer<typeof userListSchema>;

export const clientSchema = z.object({
  id: _.serialId,
  fname: _.fname,
  lname: _.lname,
  side: _.side,
  status: _.status,
});
export type Client = z.infer<typeof clientSchema>;

export const clientDataSchema = clientSchema.omit({ id: true });
export type ClientData = z.infer<typeof clientDataSchema>;

export const clientListSchema = z.array(clientSchema);
export type ClientList = z.infer<typeof clientListSchema>;

export const attendanceQuerySchema = z.object({
  date: _.date,
  side: _.side,
});
export type AttendanceQuery = z.infer<typeof attendanceQuerySchema>;

export const attendanceSchema = z.object({
  cid: _.serialId,
  fname: _.fname,
  lname: _.lname,
  attendance_status: _.attendance_status.nullable(),
});
export type Attendance = z.infer<typeof attendanceSchema>;

export const attendanceListSchema = z.array(attendanceSchema);
export type AttendanceList = z.infer<typeof attendanceListSchema>;

export const attendanceUpsertSchema = z.array(
  z.object({
    cid: _.serialId,
    attendance_date: _.date,
    attendance_status: _.attendance_status,
  })
);
export type AttendanceUpsert = z.infer<typeof attendanceUpsertSchema>;

export const clientsQuerySchema = z.object({
  name: z.string(),
});
export type ClientsQuery = z.infer<typeof clientsQuerySchema>;

export const goalsQuerySchema = z.object({
  cid: _.serialId,
  title: z.string().optional(),
});
export type GoalsQuery = z.infer<typeof goalsQuerySchema>;

export const goalUpdateSchema = z.object({
  id: _.serialId,
  title: z.string().min(1),
  instructions: z.string().optional(),
  objective: z.string().optional(),
  reinforcer: z.string().optional(),
});
export type GoalUpdate = z.infer<typeof goalUpdateSchema>;

export const goalDataQuerySchema = z.object({
  gid: _.serialId,
  date: _.date,
});
export type GoalQuery = z.infer<typeof goalDataQuerySchema>;

export const upsertGoalDataSchema = z.object({
  gid: _.serialId,
  date: _.date,
  activity: z.string().min(1),
  prompt_level: z.string().length(2),
  initial: z.string().length(2),
  comments: z.string().optional(),
});
export type UpsertGoalDataReq = z.infer<typeof upsertGoalDataSchema>;

export const getUsersSchema = z.object({
  username: _.username,
});
export type GetUsersReq = z.infer<typeof getUsersSchema>;

export const apiResponseSchema = z.discriminatedUnion("success", [
  z.object({
    success: z.literal(true),
    data: z.any(),
    message: z.string().optional(),
  }),
  z.object({
    success: z.literal(false),
    message: z.string(),
    errors: z.string().optional(),
  }),
]);

export type ApiResponse<T> = z.infer<typeof apiResponseSchema>;
export type SuccessResponse<T> = Extract<ApiResponse<T>, { success: true }>;
export type FailResponse = Extract<ApiResponse<any>, { success: false }>;
