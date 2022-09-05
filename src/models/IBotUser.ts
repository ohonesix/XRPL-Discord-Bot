interface IBotUser {
  discordId: string;
  discordUsername: string;
  discordDiscriminator: string;
  previousDiscordUsername: string;
  previousDiscordDiscriminator: string;
  totalPoints: number;
  wallets: IWallet[];
}
