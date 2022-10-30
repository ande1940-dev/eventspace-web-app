// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { exampleRouter } from "./example";
import { friendRequestRouter } from "./friendRequest";
import { userRouter } from "./user"
import { notificationRouter } from "./notification";
import { authRouter } from "./auth";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  
  friendRequest: friendRequestRouter,
  user: userRouter,
  notification: notificationRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
