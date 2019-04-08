import React, { useState } from 'react';

import useGraphqlFetch from './useGraphqlFetch';

function App() {
  const [toggle, setToggle] = useState(false);

  const url = 'https://onetrust-graphql-yoga.now.sh/';

  const query = {
    type: 'mlo',
    fields: ['firstName', 'lastName', 'title', 'email', 'phone', 'mobilePhone', 'fax', 'mloPage', 'nmlsNumber'],
    variable: {
      key: 'account',
      value: 'gbromser',
    },
  };

  const taggedQuery = `
    {
      mlo(account: "gbromser") {
        firstName
        lastName
      }
    }
  `;

  const [data, error, loading, triggerFetch] = useGraphqlFetch(url, taggedQuery, false);

  console.log(loading);
  console.log(error);
  console.log(data);

  if (loading) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>~Experiments~</h1>
      <button onClick={() => setToggle(!toggle)}>Toggle</button>
      <button onClick={triggerFetch}>Trigger Fetch</button>
    </div>
  );
}
export default App;
