import axios from 'axios';
import SETTINGS from '../../settings';

const getTradingDetails = async (token: string): Promise<any> => {
  const config = {
    headers: {
      accept: 'application/json, text/plain, */*',
      'accept-language': 'en-US,en;q=0.9',
      'cache-control': 'no-cache',
      'content-type': 'application/json',
      pragma: 'no-cache',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
      'sec-gpc': '1',
      Referer: 'https://ohonesix.com/',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
  };

  const params = `{"symbols":["${token}"]}`;

  const result = await axios
    .post(SETTINGS.SOLOGENIC.API_URL, params, config)
    .then((response) => {
      if (response.status !== 200) {
        throw new Error();
      }

      const asString = JSON.stringify(response.data);
      const cleaned = asString.replace(token, 'priceData');

      const parsed = JSON.parse(cleaned);
      return {
        price: parsed?.priceData?.last_price,
        volume: parsed?.priceData?.volume,
      };
    })
    .catch((error) => {
      return null;
    });

  return result;
};

export { getTradingDetails };
