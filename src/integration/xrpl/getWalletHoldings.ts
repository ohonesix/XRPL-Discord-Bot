import SETTINGS from '../../settings';
import sleep from '../../utils/sleep';
// tslint:disable-next-line
const XRPL = require('xrpl');

const xrplClient = new XRPL.Client(SETTINGS.XRPL.SERVER_URL);
xrplClient.connect();

const getWalletHoldings = async (
  address: string,
  LOGGER: any
): Promise<number> => {
  try {
    if (!xrplClient.isConnected()) {
      await xrplClient.connect();
    }

    const response = await xrplClient.request({
      command: 'account_lines',
      account: address,
    });

    let holdings = parseFloat(
      response?.result?.lines?.filter(
        (trustLine: any) => trustLine.currency === SETTINGS.XRPL.TOKEN_HASH
      )[0]?.balance
    );

    if (isNaN(holdings)) {
      let marker = response.result.marker;
      for (let index = 0; index < 10; index++) {
        await sleep(150);

        const seekResponse = await xrplClient.request({
          command: 'account_lines',
          account: address,
          marker,
        });

        marker = seekResponse.result.marker;

        holdings = parseFloat(
          seekResponse?.result?.lines?.filter(
            (trustLine: any) => trustLine.currency === SETTINGS.XRPL.TOKEN_HASH
          )[0]?.balance
        );

        if (!isNaN(holdings) || !marker) {
          break;
        }
      }
    }

    if (isNaN(holdings) || !holdings) {
      holdings = 0;
    }

    return holdings;
  } catch (error) {
    // Dont care about logging these as its not really an error,
    // just that the user doesn't have the trustline.
    if (error?.data?.error === 'actNotFound') {
      // Return -1 so no trustline error is caught
      return -1;
    }

    if (SETTINGS.APPLICATION_INSIGHTS.ENABLED && LOGGER !== null) {
      LOGGER.trackException({
        exception: new Error(error),
      });
    }
    console.log(error);

    await xrplClient.disconnect();
    return null;
  }
};

export { getWalletHoldings };
