/**
 * Beatmap metadata response from REST API.
 */
export interface IBeatmapMetadata {
  beatmapsetId: number;
  creatorId: number;
  creator: string;
  title: string;
  artist: string;
  version: string;
}
