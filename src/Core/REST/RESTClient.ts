import { APIClient, IAPIResponse, RequestConfig } from '@kionell/osu-api';
import { IBeatmapOptionsDto, IScoreOptionsDto, IDiscordChannelDto } from './DTO';
import { IBeatmapResponse, IScoreResponse, IDiscordChannelResponse } from './Interfaces';

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

    this._handleError(response);

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

    this._handleError(response);

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

    this._handleError(response);

    return response.data;
  }

  /**
   * Finds a discord channel in the database.
   * @param channelId Discord channel ID.
   * @returns Discord channel response or null.
   */
  async findDiscordChannel(channelId: string | number): Promise<IDiscordChannelResponse | null> {
    const url = `${process.env.API_ROOT as string}/discord/channels/${channelId}`;
    const response = await this._request({
      method: 'GET',
      url,
    });

    if (response.error) return null;

    return response.data;
  }

  /**
   * Upserts a new discord channel in the database.
   * @param channelDto Discord channel data.
   * @returns Discord channel response.
   */
  async upsertDiscordChannel(options: Partial<IDiscordChannelDto>): Promise<IDiscordChannelResponse> {
    const url = `${process.env.API_ROOT as string}/discord/channels`;
    const response = await this._request({
      method: 'POST',
      data: options,
      url,
    });

    return response.data;
  }

  protected async _request(config: RequestConfig): Promise<IAPIResponse> {
    /**
     * If this REST API is not available we will allow 
     * to retry connection only once every 30 seconds. 
     */
    if (!this.isAvailable) {
      throw new Error('Bot API is currently offline or not available!');
    }

    const response = await super._request(config);

    const lostConnection = response.error === 'read ECONNRESET';
    const notAvailable = response.error === 'Can\'t connect to API!';

    if (lostConnection || notAvailable) {
      this.isOnline = false;
      this.lastAttempt = Date.now();
      
      this._handleError(response);
    }

    if (!this.isOnline) this.isOnline = true;

    return response;
  }

  get isAvailable(): boolean {
    return this.isOnline || Date.now() - this.lastAttempt >= 30000;
  }

  private _handleError(response: IAPIResponse): void {
    if (response.error === 'read ECONNRESET') {
      throw new Error('Lost connection to the Bot API!');
    }

    if (response.error) {
      throw new Error(response.error);
    }
  }
}

export default RESTClient.getInstance() as RESTClient;
