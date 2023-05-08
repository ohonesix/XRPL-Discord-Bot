interface IFarming {
  discordId: string;
  rewardPointsRequired: number;
  rewardGoalAmount: number;
  rewardGoalHoursRequired: number;
  hoursFarmed: number;
  isActive: boolean;
  dateStarted: string;
}
