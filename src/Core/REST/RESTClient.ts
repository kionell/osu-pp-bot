import { APIClient, IAPIResponse, RequestConfig } from '@kionell/osu-api';
import { IBeatmapOptionsDto, IScoreOptionsDto, IChatChannelDto } from './DTO';
import { IBeatmapResponse, IChatChannelResponse, IScoreResponse } from './Interfaces';

class RESTClient extends APIClient {
  /**
   * If this REST API client is online at the moment.
   */
  isOnline = true;

  /**
   * Time of the last connection attempt.
   */
  lastAttempt = 0;

  /**
   * Calculates a beatmap by beatmap options.
   * @param options Beatmap options.
   * @returns Beatmap response from REST API.
   */
  async calculateBeatmap(options: IBeatmapOptionsDto): Promise<IBeatmapResponse> {
    const url = `${process.env.API_ROOT as string}/beatmaps`;
    const response = await this._request({
      method: 'POST',
      data: options,
      url,
    });

    return response.data;
  }

  /**
   * Gets beatmap strain graph from the server based on its file name.
   * @param fileName File name of the beatmap strain graph.
   * @returns URL to the beatmap strain graph.
   */
  async getBeatmapGraph(fileName?: string): Promise<Buffer | null> {
    if (!fileName) return null;

    const url = `${process.env.SERVER_ROOT as string}/strains/${fileName}`;
    const response = await this._request({
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'image/png',
      },
      url,
    });

    if (response.error) return null;

    return response.data;
  }

  /**
   * Gets replay life bar graph from the server based on its file name.
   * @param fileName File name of the replay life bar graph.
   * @returns URL to the replay life bar graph.
   */
  async getReplayGraph(fileName?: string): Promise<Buffer | null> {
    if (!fileName) return null;

    const url = `${process.env.SERVER_ROOT as string}/lifebars/${fileName}`;
    const response = await this._request({
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'image/png',
      },
      url,
    });

    if (response.error) return null;

    return response.data;
  }

  /**
   * Calculates a score by score options.
   * @param options Score options.
   * @returns Score response from REST API.
   */
  async calculateScore(options: IScoreOptionsDto): Promise<IScoreResponse> {
    const url = `${process.env.API_ROOT as string}/scores`;
    const response = await this._request({
      method: 'POST',
      data: options,
      url,
    });

    return response.data;
  }

  /**
   * Simulates a new score by score options.
   * @param options Score options.
   * @returns Score response from REST API.
   */
  async simulateScore(options: IScoreOptionsDto): Promise<IScoreResponse> {
    const url = `${process.env.API_ROOT as string}/scores/simulate`;
    const response = await this._request({
      method: 'POST',
      data: options,
      url,
    });

    return response.data;
  }

  /**
   * Finds a chat channel in the database.
   * @param channelId Chat channel ID.
   * @returns Chat channel response or null.
   */
  async findChatChannel(channelId: string | number): Promise<IChatChannelResponse | null> {
    const url = `${process.env.API_ROOT as string}/chat/channels/${channelId}`;
    const response = await this._request({
      method: 'GET',
      url,
    });

    if (response.error) return null;

    return response.data;
  }

  /**
   * Upserts a new chat channel in the database.
   * @param channelDto Chat channel data.
   * @returns Chat channel response.
   */
  async upsertChatChannel(options: Partial<IChatChannelDto>): Promise<IChatChannelResponse> {
    const url = `${process.env.API_ROOT as string}/chat/channels`;
    const response = await this._request({
      method: 'POST',
      data: options,
      url,
    });

    return response.data;
  }

  protected async _request(config: RequestConfig): Promise<IAPIResponse> {
    const response = await super._request(config);

    this._handleError(response);

    if (!response.error && !this.isOnline) {
      this.isOnline = true;
    }

    return response;
  }

  get isAvailable(): boolean {
    return this.isOnline || Date.now() - this.lastAttempt >= 30000;
  }

  private _handleError(response: IAPIResponse): void {
    if (!response.error) return;

    const wasOnline = this.isOnline;

    switch (response.error) {
      case 'read ECONNRESET':
      case 'Can\'t connect to API!':
        this.isOnline = false;
        this.lastAttempt = Date.now();

        // Throw error only when status switches from online to offline.
        if (wasOnline && !this.isOnline) {
          console.error(this._getErrorDisplayMessage(response));
        }

        break;

      default:
        console.error(this._getErrorDisplayMessage(response));
    }
  }

  private _getErrorDisplayMessage(response: IAPIResponse): string {
    switch (response.error) {
      case 'read ECONNRESET':
        return 'Lost connection to the Bot API!';

      case 'Can\'t connect to API!':
        return 'Bot API is currently offline or not available!';
    }

    return response.error ?? 'Something went wrong...';
  }
}

export default RESTClient.getInstance() as RESTClient;
