import { auth } from "@/lib/auth/auth";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

export async function createTRPCContext(opts: { headers: Headers }) {
  const authSession = await auth.api.getSession({ headers: opts.headers });
  return { user: authSession?.user };
}

type Context = Awaited<ReturnType<typeof createTRPCContext>>;
const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter: ({ shape, error }) => ({
    ...shape,
    data: {
      ...shape.data,
      zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
    },
  }),
});

export const createCallerFactory = t.createCallerFactory;
export const router = t.router;
export const publicProcedure = t.procedure;

function createProtectedProcedure(allowedRoles: string[]) {
  return t.procedure.use(({ ctx, next }) => {
    if (!ctx.user?.id) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "You must be logged in to perform this action." });
    }

    if (!ctx.user.role || !allowedRoles.includes(ctx.user.role)) {
      throw new TRPCError({ code: "FORBIDDEN", message: "You do not have permission to perform this action." });
    }

    return next({ ctx: { user: ctx.user } });
  });
}

export const adminProcedure = createProtectedProcedure(["admin"]);
export const writeProcedure = createProtectedProcedure(["admin", "write"]);
export const readProcedure = createProtectedProcedure(["admin", "write", "read"]);
