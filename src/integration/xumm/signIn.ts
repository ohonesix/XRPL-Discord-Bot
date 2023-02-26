import { XummSdk, XummTypes } from 'xumm-sdk';
import SETTINGS from '../../settings';

// Start a new login session
const signIn = async (discordId: string) => {
  const xumm = new XummSdk(SETTINGS.XUMM.API_KEY, SETTINGS.XUMM.API_SECRET);

  const request: XummTypes.XummJsonTransaction = {
    TransactionType: 'SignIn',
    custom_meta: {
      blob: JSON.stringify({ userId: discordId }),
    },
  };

  const payload = await xumm.payload.create(request);

  return {
    signInQrUrl: payload.refs.qr_png,
    signInDirectLink: payload.next.always,
  };
};

export default signIn;
