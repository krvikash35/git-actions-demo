import { createStore } from "../module/mstore";
import * as user from "./user";
import * as wishlist from "./wishlist";

const store = {
  user,
  wishlist
};
export default createStore(store);
