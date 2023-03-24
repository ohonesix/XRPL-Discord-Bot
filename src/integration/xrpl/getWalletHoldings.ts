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

    // Check account lines for TOKEN holdings
    const response = await xrplClient.request({
      command: 'account_lines',
      ledger_index: 'validated',
      account: address,
    });

    // See if we got the trustline in the first response
    let holdings = parseFloat(
      response?.result?.lines?.filter(
        (trustLine: any) => trustLine.currency === SETTINGS.XRPL.TOKEN_HASH
      )[0]?.balance
    );

    if (isNaN(holdings)) {
      // We didn't, need to seek for it
      let marker = response.result.marker;
      while (marker) {
        await sleep(150);

        const seekResponse = await xrplClient.request({
          command: 'account_lines',
          ledger_index: 'validated',
          account: address,
          marker,
        });

        holdings = parseFloat(
          seekResponse?.result?.lines?.filter(
            (trustLine: any) => trustLine.currency === SETTINGS.XRPL.TOKEN_HASH
          )[0]?.balance
        );

        marker = seekResponse.result.marker;

        // We can stop once we get the trustline
        if (!isNaN(holdings) || !marker) {
          break;
        }
      }
    }

    // Check account NFTs for NFT holdings
    if (SETTINGS.XRPL.ENABLE_NFT) {
      const nftResponse = await xrplClient.request({
        command: 'account_nfts',
        ledger_index: 'validated',
        account: address,
      });

      // Check if we got the NFT holdings in the first call
      const nftHoldings = parseFloat(
        nftResponse?.result?.account_nfts?.filter(
          (nft: any) => nft.Issuer === SETTINGS.XRPL.NFT_ISSUER_ADDRESS
        )?.length ?? 0
      );

      let marker = nftResponse.result.marker;
      let nftSeek = 0;

      // If we get a marker we need to check all paged results too
      while (marker) {
        await sleep(150);

        const seekNftResponse = await xrplClient.request({
          command: 'account_nfts',
          ledger_index: 'validated',
          account: address,
          marker,
        });

        nftSeek += parseFloat(
          seekNftResponse?.result?.account_nfts?.filter(
            (nft: any) => nft.Issuer === SETTINGS.XRPL.NFT_ISSUER_ADDRESS
          )?.length ?? 0
        );

        if (seekNftResponse.result.marker === marker) {
          break;
        }

        marker = seekNftResponse.result.marker;
      }

      holdings += nftHoldings + nftSeek;
    }

    // Default
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
