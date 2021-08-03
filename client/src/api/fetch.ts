interface IApiFetch {
  headers?: { [key: string]: string };
  query?: { [key: string]: string | number };
  body?: BodyInit | undefined | null;
}

const setQuery = (query: object) => {
  let _query = '?';
  for (const [key, value] of Object.entries(query)) {
    _query += `${key}=${value}&`;
  }
  return _query.slice(0, -1);
};

const serverURL = 'http://localhost:3000/api';

export const getFetch = async <T>(url: string, options?: IApiFetch): Promise<T> => {
  let querystring = '';
  if (options?.query) {
    querystring = setQuery(options.query);
  }

  const fetchUrl = serverURL + url + querystring;
  const response = await fetch(fetchUrl, {
    method: 'GET',
    credentials: 'include',
    headers: options?.headers,
  });

  if (response.status >= 400) {
    const res = JSON.stringify(await response.json());
    throw new Error(`${response.status}: ${res}`);
  }

  return await response.json();
};

export const postFetch = async<T>(url: string, options?: IApiFetch): Promise<T> => {
  let querystring = '';
  if (options?.query) {
    querystring = setQuery(options.query);
  }

  const fetchUrl = serverURL + url + querystring;
  const response = await fetch(fetchUrl, {
    method: 'POST',
    credentials: 'include',
    headers: options?.headers,
    body: options?.body
  });

  if (response.status >= 400) {
    const res = JSON.stringify(await response.json());
    throw new Error(`${response.status}: ${res}`);
  }

  return await response.json();

}

export const deleteFetch = async<T>(url: string, options?: IApiFetch): Promise<T> => {
  let querystring = '';
  if (options?.query) {
    querystring = setQuery(options.query);
  }

  const fetchUrl = serverURL + url + querystring;
  const response = await fetch(fetchUrl, {
    method: 'DELETE',
    credentials: 'include',
    headers: options?.headers,
  });

  if (response.status >= 400) {
    const res = JSON.stringify(await response.json());
    throw new Error(`${response.status}: ${res}`);
  }

  return await response.json();
}