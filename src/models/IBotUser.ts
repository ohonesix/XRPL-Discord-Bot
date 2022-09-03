interface IBotUser {
  discordId: string;
  discordUsername: string;
  discordDiscriminator: string;
  previousDiscordUsername: string;
  previousDiscordDiscriminator: string;
  wallets: IWallet[];
}
