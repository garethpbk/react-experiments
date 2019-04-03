import { useCallback, useEffect, useState } from 'react';

function buildQueryString(query) {
  const { type, fields, variable } = query;

  const queryString = `\n query {\n ${type}(${variable.key}: "${variable.value}" ) {\n
    ${fields.map(field => `${field}`).join('\n')}\n
  }\n}`;

  return JSON.stringify({ query: queryString });
}

function determineQueryType(query) {
  if (typeof query === 'object') {
    return buildQueryString(query);
  } else if (typeof query === 'string') {
    return JSON.stringify({ query });
  }
}

async function fetchApi(url, queryString, setLoading) {
  setLoading(true);

  const apiRequest = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: queryString,
    // body: JSON.stringify({ query }),
  });

  const apiResponse = await apiRequest.json();

  setLoading(false);

  return apiResponse;
}

function useGraphQlFetch(url, query, manual = false) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});

  if (!manual) {
    useEffect(() => {
      const queryString = determineQueryType(query);

      fetchApi(url, queryString, setLoading).then(res => setData(res));
    }, [Object.keys(query).length > 0 || query.length > 0]);
  }

  const triggerFetch = useCallback(() => {
    const queryString = determineQueryType(query);

    fetchApi(url, queryString, setLoading).then(res => setData(res));
  });

  return [data, loading, triggerFetch];
}

export default useGraphQlFetch;
