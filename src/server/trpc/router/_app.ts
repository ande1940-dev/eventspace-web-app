// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { exampleRouter } from "./example";
import { friendRequestRouter } from "./friendRequest";
import { userRouter } from "./user"
import { authRouter } from "./auth";
import { friendshipRouter } from "./friendship";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  friendRequest: friendRequestRouter,
  friendship: friendshipRouter,
  user: userRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
