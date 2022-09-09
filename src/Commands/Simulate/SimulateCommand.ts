import { APIFactory, GameMode, URLScanner } from '@kionell/osu-api';
import { AttachmentType, BotCommand, CommandAttachments, ICommandOptions, IHasAttachments } from '@Core/Commands';
import { IScoreOptionsDto, RESTClient } from '@Core/REST';
import { getBeatmapIdFromMessage } from '@Core/Utils';
import { EmbedFactory } from '@Embeds';
import { BeatmapArgument, ModsFlag, SearchFlag } from '@Options';

export abstract class SimulateCommand extends BotCommand implements IHasAttachments {
  description = [
    'Allows you to simulate osu! scores.',
    'Non-submitted beatmaps are also supported.',
    'This command can work with different ways of beatmap input:',
    '\n\t**1. Beatmap ID or URL** - will search for a beatmap file on a specific game server;',
    '\n\t**2. Beatmap files (`.osu`)** - will parse this file directly;',
    '\n\t**3. Replay files (`.osr`)** - will search for a beatmap file by beatmap hash.',
    '\n\t**4. Message replies** - you can reply to the `.osu` and `.osr` files, links or embeds.',
    '\n\t**5. Channel history** - this bot can use embeds of __almost all popular osu! bots__ to save beatmap ID.',
  ].join(' ');

  shortDescription = 'Allows you to simulate osu! scores.';

  /**
   * Attachments of this command.
   */
  attachments: CommandAttachments = new CommandAttachments();

  constructor() {
    super();

    this.addOption(new BeatmapArgument());
    this.addOption(new ModsFlag());
    this.addOption(new SearchFlag());
  }

  async execute(options: ICommandOptions): Promise<void> {
    const dto = this._getScoreDto(options);
    const score = await RESTClient.simulateScore(dto);

    const urlGenerator = APIFactory.createURLGenerator();

    const embed = EmbedFactory.createScoreEmbed(score, urlGenerator);

    if (!embed) return;

    embed.setCustomImageURL(
      urlGenerator.generateBeatmapCoverURL(score.beatmap.metadata.beatmapsetId),
    );

    await this._getEmbedShipment(options)
      .embeds(await embed.build())
      .send();
  }

  protected _getScoreDto(options: ICommandOptions): IScoreOptionsDto {
    const dto: IScoreOptionsDto = {};

    const scanner = APIFactory.createURLScanner();
    const targetBeatmap = this._getTargetBeatmap(scanner, options);

    if (typeof targetBeatmap === 'number' && targetBeatmap) {
      dto.beatmapId = targetBeatmap;
    }

    const targetSearch = this.getValue(SearchFlag);

    if (typeof targetSearch === 'string') {
      dto.search = targetSearch;

      // Cached beatmap ID will have higher priority so we will delete it.
      delete dto.beatmapId;
    }

    const beatmapAttachment = this.attachments
      .getAttachmentOfType(AttachmentType.Beatmap);

    if (beatmapAttachment !== null) {
      dto.fileURL = beatmapAttachment.url;

      // Cached beatmap ID will have higher priority so we will delete it.
      delete dto.beatmapId;
    }

    const replayAttachment = this.attachments
      .getAttachmentOfType(AttachmentType.Score);

    if (replayAttachment !== null) {
      dto.replayURL = replayAttachment.url;
    }

    const targetRuleset = this._getDefaultRulesetId();

    if (targetRuleset !== null) {
      dto.rulesetId = targetRuleset;
    }

    const targetMods = this.getValueOrDefault(ModsFlag);
    const modsNumber = Number(targetMods);

    dto.mods = !isNaN(modsNumber) ? modsNumber : targetMods;

    return dto;
  }

  protected _getTargetBeatmap(scanner: URLScanner, options: ICommandOptions): number | null {
    const targetBeatmap = this.getValue(BeatmapArgument);

    const raw = Number(targetBeatmap);
    const url = scanner.getBeatmapIdFromURL(targetBeatmap);
    const reference = options.msg ? getBeatmapIdFromMessage(scanner, options.msg) : 0;

    return raw || url || reference || options.cachedChannel.beatmapId;
  }

  protected abstract _getDefaultRulesetId(): GameMode | null;
}
