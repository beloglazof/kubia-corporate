import { useEffect, useState } from 'react';

const useAsync = (asyncMethod, initialValue, deps = [], ...params) => {
  const [data, setData] = useState(initialValue);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await asyncMethod(...params);
        if (fetchedData) {
          setData(fetchedData);
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, deps);

  return [data, setData];
};

export default useAsync;
