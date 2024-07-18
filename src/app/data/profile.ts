export interface Profile {
  /** Account id */
  id: string;

  /** Avatar id */
  avatarId: string | null;

  /** Account nickname */
  nickname: string;

  /** Access token */
  accessToken: string;
}
