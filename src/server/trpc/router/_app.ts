// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { exampleRouter } from "./example";
import { friendRequestRouter } from "./friendRequest";
import { friendshipRouter } from "./friendship";
import { userRouter } from "./user"
import { authRouter } from "./auth";
import { blockRouter } from "./block";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  block: blockRouter,
  friendRequest: friendRequestRouter,
  friendship: friendshipRouter,
  user: userRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
