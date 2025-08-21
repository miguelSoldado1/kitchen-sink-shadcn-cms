import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@/server/routers/_routers";

export const trpc = createTRPCReact<AppRouter>({});
