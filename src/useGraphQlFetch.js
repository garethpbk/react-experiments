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

function handleErrorResponse(errors) {
  console.log(errors);
}

async function fetchApi(url, queryString, setLoading) {
  setLoading(true);

  try {
    const apiRequest = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: queryString,
    });

    const apiResponse = await apiRequest.json();

    setLoading(false);

    if (apiResponse.hasOwnProperty('errors')) {
      return {
        type: 'error',
        response: apiResponse,
      };
    }

    return {
      type: 'success',
      response: apiResponse,
    };
  } catch (err) {
    const formattedErrors = handleErrorResponse(err);

    setLoading(false);

    return {
      type: 'error',
    };
  }

  // return apiResponse;
}

function returnDataOrError(res, setData, setError) {
  if (res.type === 'error') {
    const errorLocation = `Line ${res.response.errors[0].locations[0].line}, Column ${
      res.response.errors[0].locations[0].column
    }`;
    setError(`${errorLocation}: ${res.response.errors[0].message}`);
  }

  setData(res.response.data);
}

function useGraphqlFetch(url, query, manual = false) {
  const [data, setData] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!manual) {
    useEffect(() => {
      const queryString = determineQueryType(query);

      fetchApi(url, queryString, setLoading).then(res => returnDataOrError(res, setData, setError));
    }, [Object.keys(query).length > 0 || query.length > 0]);
  }

  const triggerFetch = useCallback(() => {
    const queryString = determineQueryType(query);

    fetchApi(url, queryString, setLoading).then(res => returnDataOrError(res, setData, setError));
  });

  return [data, error, loading, triggerFetch];
}

export default useGraphqlFetch;
