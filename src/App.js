import React, {useEffect} from "react";
import { useStore } from "./module/mstore";
import { resetAll } from "./storenew/user";

function App() {
  const user = useStore("user");

  return (
    <div>
      <button onClick={user.resetAll}>hello: {user.name}</button>
      <button onClick={user.getUsers}>fetch users</button>
      <button onClick={user.getUsers.cancel}>cancell </button>
      <button onClick={user.getUsers.reset}>reset </button>
      {user.getUsers.loading ? (
        <div> loading....</div>
      ) : (
        user.getUsers.data &&
        user.getUsers.data.map(u => (
          <div onClick={user.getUser.bind(null, u.id)}>{u.name}
            {
              user.getUser.loading? <div>Loading...</div>: <div>{JSON.stringify(user.getUser.data)}</div>
            }
            <br/>
            <br/>
          </div>
        
        ))
      )}
    </div>
  );
}

export default App;
