import moonraker from "."

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T
type Moonraker = ThenArg<ReturnType<typeof moonraker>>
