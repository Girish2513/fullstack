import { add } from "@shared/math";
import { now, UserSchema } from "@shared/index";
console.log(add(2, 3));
console.log("Server time:", now());
const result = UserSchema.safeParse({ id: "1", name: "Girish" });
console.log(result.success);
