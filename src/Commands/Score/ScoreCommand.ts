import { Message } from 'discord.js';
import { Argument, IHasArgument } from 'cli-processor';
import { APIFactory, getRulesetId, getServerName, URLScanner } from '@kionell/osu-api';
import { BotCommand, CommandAttachments, AttachmentType, ICommandOptions, IHasAttachments, Category } from '@Core/Commands';
import { IScoreOptionsDto, RESTClient } from '@Core/REST';
import { EmbedShipment } from '@Core/Embeds';
import { getScoreIdFromMessage } from '@Core/Utils';
import { ServerFlag } from '@Flags';
import { EmbedFactory } from '@Embeds';

export class ScoreCommand extends BotCommand implements IHasAttachments, IHasArgument {
  name = 'score';

  title = 'Score command';

  description = 'Gives you information about a score';

  arg = new Argument<string>({
    description: 'Score URL',
    isRequired: false,
    minLength: 1,
  });

  category = Category.Osu;

  /**
   * Attachments of this command.
   */
  attachments: CommandAttachments = new CommandAttachments();

  constructor(params?: Partial<ScoreCommand>) {
    super(params);

    this.registerFlag(new ServerFlag());
  }

  async execute({ msg }: ICommandOptions): Promise<void> {
    const targetServer = this._getTargetServer();
    const generator = APIFactory.createURLGenerator(targetServer);

    const dto = this._getScoreDto(msg);
    const score = await RESTClient.calculateScore(dto);

    const embed = EmbedFactory.createScoreEmbed(score, generator);

    const shipment = new EmbedShipment(msg);

    await shipment
      .embeds(await embed.build())
      .send();
  }

  protected _getScoreDto(msg: Message): IScoreOptionsDto {
    const dto: IScoreOptionsDto = {};

    const targetServer = this._getTargetServer();
    const scanner = APIFactory.createURLScanner(targetServer);

    if (typeof targetServer === 'string') {
      dto.server = targetServer;
    }

    const targetScore = this._getTargetScore(scanner, msg);

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
    }

    return dto;
  }

  protected _getTargetServer(): ReturnType<typeof getServerName> {
    const targetBeatmap = this.getValue(this.arg);

    return this.getFlagValue(ServerFlag) ?? getServerName(targetBeatmap);
  }

  protected _getTargetScore(scanner: URLScanner, msg: Message): number | null {
    return getScoreIdFromMessage(scanner, msg) || null;
  }

  protected _getTargetRuleset(scanner: URLScanner): number | null {
    const targetScore = this.getValue(this.arg);
    const scanned = scanner.getRulesetIdFromURL(targetScore);

    return scanned !== null ? getRulesetId(scanned) : null;
  }
}
