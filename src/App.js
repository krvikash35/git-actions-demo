import React from 'react';
import {useStore} from './module/mstore'

function App() {
  const user = useStore('user')
  console.log('user', user)
  return (
      <div>
        <button onClick={user.getUsers}>fetch users</button>
        <button onClick={user.hello}>hello: {user.name}</button>
        {user.getUsers.data && user.getUsers.data.map(u => (
          <div onClick={user.getUser.bind(null,u.id)}>{u.name}</div>
        ))}
    </div>
  );
}

export default App;
