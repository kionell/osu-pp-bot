import { APIFactory, getRulesetId, getServerName, URLScanner } from '@kionell/osu-api';
import { BotCommand, CommandAttachments, AttachmentType, ICommandOptions, IHasAttachments, Category } from '@Core/Commands';
import { IScoreOptionsDto, RESTClient } from '@Core/REST';
import { getScoreIdFromMessage } from '@Core/Utils';
import { ScoreArgument, ServerFlag } from 'src/Options';
import { EmbedFactory } from '@Embeds';
import { MessageAttachment } from 'discord.js';

export class ScoreCommand extends BotCommand implements IHasAttachments {
  name = 'score';

  title = 'Score command';

  description = 'Gives you information about a score';

  category = Category.Osu;

  /**
   * Attachments of this command.
   */
  attachments: CommandAttachments = new CommandAttachments();

  constructor(params?: Partial<ScoreCommand>) {
    super(params);

    this.addOption(new ScoreArgument());
    this.addOption(new ServerFlag());
  }

  async execute(options: ICommandOptions): Promise<void> {
    const targetServer = this._getTargetServer();
    const generator = APIFactory.createURLGenerator(targetServer);

    const dto = this._getScoreDto(options);
    const score = await RESTClient.calculateScore(dto);
    const replayGraph = await RESTClient.getReplayGraph(score.graphFile);

    const embed = EmbedFactory.createScoreEmbed(score, generator);
    const embedShipment = this._getEmbedShipment(options);

    if (replayGraph) {
      const graphAttachment = this._createGraphAttachment(replayGraph);

      embed.setCustomImageURL('attachment://lifebar.png');

      embedShipment.attachments(graphAttachment);
    }
    else {
      embed.setCustomImageURL(
        generator.generateBeatmapCoverURL(score.beatmap.metadata.beatmapsetId),
      );
    }

    await embedShipment.embeds(await embed.build()).send();
  }

  protected _getScoreDto(options: ICommandOptions): IScoreOptionsDto {
    const dto: IScoreOptionsDto = {};

    const targetServer = this._getTargetServer();
    const scanner = APIFactory.createURLScanner(targetServer);

    if (typeof targetServer === 'string') {
      dto.server = targetServer;
    }

    const targetScore = this._getTargetScore(scanner, options);

    if (typeof targetScore === 'number') {
      dto.scoreId = targetScore;
    }

    const targetRuleset = this._getTargetRuleset(scanner);

    if (typeof targetRuleset === 'number') {
      dto.rulesetId = targetRuleset;
    }

    const beatmapAttachment = this.attachments.getAttachmentOfType(AttachmentType.Beatmap);

    if (beatmapAttachment !== null) {
      dto.fileURL = beatmapAttachment.url;
    }

    const replayAttachment = this.attachments.getAttachmentOfType(AttachmentType.Score);

    if (replayAttachment !== null) {
      dto.replayURL = replayAttachment.url;
      dto.drawGraph = true;
    }

    return dto;
  }

  protected _getTargetServer(): ReturnType<typeof getServerName> {
    const targetScore = this.getValue(ScoreArgument);

    return this.getValue(ServerFlag) ?? getServerName(targetScore);
  }

  protected _getTargetScore(scanner: URLScanner, options: ICommandOptions): number | null {
    const targetScore = this.getValue(ScoreArgument);

    const url = scanner.getScoreIdFromURL(targetScore);
    const reference = options.msg ? getScoreIdFromMessage(scanner, options.msg) : 0;

    return url || reference || null;
  }

  protected _getTargetRuleset(scanner: URLScanner): number | null {
    const targetScore = this.getValue(ScoreArgument);
    const scanned = scanner.getRulesetIdFromURL(targetScore);

    return scanned !== null ? getRulesetId(scanned) : null;
  }

  protected _createGraphAttachment(strainGraph: Buffer | null): MessageAttachment | null {
    if (!strainGraph) return null;

    return new MessageAttachment(strainGraph, 'lifebar.png');
  }
}
