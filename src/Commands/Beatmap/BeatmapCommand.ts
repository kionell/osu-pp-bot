import { MessageAttachment } from 'discord.js';
import { APIFactory, getRulesetId, URLScanner } from '@kionell/osu-api';
import { BotCommand, CommandAttachments, AttachmentType, ICommandOptions, IHasAttachments, Category } from '@Core/Commands';
import { IBeatmapOptionsDto, RESTClient } from '@Core/REST';
import { getBeatmapIdFromMessage } from '@Core/Utils';
import { EmbedFactory } from '@Embeds';
import {
  ApproachRateFlag,
  BeatmapArgument,
  BPMFlag,
  CircleSizeFlag,
  ClockRateFlag,
  ModsFlag,
  OverallDifficultyFlag,
  RulesetFlag,
  SearchFlag,
  TotalHitsFlag,
} from '@Options';

export class BeatmapCommand extends BotCommand implements IHasAttachments {
  name = 'beatmap';

  aliases = [
    'map', 'm', 'b',
  ];

  title = 'Beatmap command';

  description = [
    'Gives you information about a beatmap.',
    'Non-submitted beatmaps are also supported.',
    'This command can work with different ways of beatmap input:',
    '\n**1. Beatmap ID or URL** - will search for a beatmap file on a specific game server;',
    '\n**2. Beatmap files (`.osu`)** - will parse this file directly;',
    '\n**3. Replay files (`.osr`)** - will search for a beatmap file by beatmap hash.',
    '\n**4. Message replies** - you can reply to the `.osu` and `.osr` files, links or embeds.',
    '\n**5. Channel history** - this bot can use embeds of __almost all popular osu! bots__ to save beatmap ID.',
  ].join(' ');

  shortDescription = 'Gives you information about a beatmap.';

  category = Category.Osu;

  /**
   * Attachments of this command.
   */
  attachments: CommandAttachments = new CommandAttachments();

  constructor() {
    super();

    this.addOption(new BeatmapArgument());
    this.addOption(new ModsFlag());
    this.addOption(new RulesetFlag());
    this.addOption(new SearchFlag());
    this.addOption(new ApproachRateFlag());
    this.addOption(new CircleSizeFlag());
    this.addOption(new OverallDifficultyFlag());
    this.addOption(new ClockRateFlag());
    this.addOption(new BPMFlag());
  }

  async execute(options: ICommandOptions): Promise<void> {
    const generator = APIFactory.createURLGenerator();

    const dto = this._getBeatmapDto(options);
    const beatmap = await RESTClient.calculateBeatmap(dto);
    const strainGraph = await RESTClient.getBeatmapGraph(beatmap.graphFile);

    const embed = EmbedFactory.createBeatmapEmbed(beatmap, generator);
    const embedShipment = this._getEmbedShipment(options);

    if (strainGraph) {
      const graphAttachment = this._createGraphAttachment(strainGraph);

      embed.setCustomImageURL('attachment://strains.png');

      embedShipment.attachments(graphAttachment);
    }
    else {
      embed.setCustomImageURL(
        generator.generateBeatmapCoverURL(beatmap.metadata.beatmapsetId),
      );
    }

    await embedShipment.embeds(await embed.build()).send();
  }

  protected _getBeatmapDto(options: ICommandOptions): IBeatmapOptionsDto {
    const dto: IBeatmapOptionsDto = {};

    const scanner = APIFactory.createURLScanner();

    dto.beatmapId = this._getTargetBeatmap(scanner, options) ?? dto.beatmapId;
    dto.rulesetId = this._getTargetRuleset(scanner) ?? dto.rulesetId;
    dto.search = this.getValue(SearchFlag) ?? dto.search;

    this._addCustomStats(dto);

    const beatmapAttachment = this.attachments.getAttachmentOfType(AttachmentType.Beatmap);

    if (beatmapAttachment !== null) dto.fileURL = beatmapAttachment.url;

    const replayAttachment = this.attachments.getAttachmentOfType(AttachmentType.Score);

    if (replayAttachment !== null) dto.replayURL = replayAttachment.url;

    if (!dto.beatmapId && !dto.fileURL && !dto.replayURL && !dto.search) {
      dto.beatmapId = options.cachedChannel.beatmapId;
    }

    const targetMods = this.getValueOrDefault(ModsFlag);
    const modsNumber = Number(targetMods);

    dto.mods = !isNaN(modsNumber) ? modsNumber : targetMods;

    return dto;
  }

  protected _getTargetBeatmap(scanner: URLScanner, options: ICommandOptions): number {
    const targetBeatmap = this.getValue(BeatmapArgument);

    const raw = Number(targetBeatmap);
    const url = scanner.getBeatmapIdFromURL(targetBeatmap);
    const reference = options.msg ? getBeatmapIdFromMessage(scanner, options.msg) : 0;

    return raw || url || reference;
  }

  protected _getTargetRuleset(scanner: URLScanner): number | null {
    const targetBeatmap = this.getValue(BeatmapArgument);
    const targetRuleset = this.getValue(RulesetFlag);

    const scanned = scanner.getRulesetIdFromURL(targetBeatmap);
    const input = targetRuleset !== null
      ? (!isNaN(+targetRuleset) ? +targetRuleset : targetRuleset)
      : scanned;

    if (typeof input === 'number' || typeof input === 'string') {
      return getRulesetId(input);
    }

    return null;
  }

  protected _addCustomStats(dto: IBeatmapOptionsDto): void {
    const approachRateFlag = this.getOption(ApproachRateFlag);
    const overallDifficultyFlag = this.getOption(OverallDifficultyFlag);
    const circleSizeFlag = this.getOption(CircleSizeFlag);

    dto.approachRate = approachRateFlag?.getValue() ?? dto.approachRate;
    dto.lockApproachRate = approachRateFlag?.raw?.endsWith('!') ?? false;

    dto.overallDifficulty = overallDifficultyFlag?.getValue() ?? dto.overallDifficulty;
    dto.lockOverallDifficulty = overallDifficultyFlag?.raw?.endsWith('!') ?? false;

    dto.circleSize = circleSizeFlag?.getValue() ?? dto.circleSize;
    dto.lockCircleSize = circleSizeFlag?.raw?.endsWith('!') ?? false;

    dto.totalHits = this.getValue(TotalHitsFlag) ?? dto.totalHits;
    dto.clockRate = this.getValue(ClockRateFlag) ?? dto.clockRate;
    dto.bpm = this.getValue(BPMFlag) ?? dto.bpm;
  }

  protected _createGraphAttachment(strainGraph: Buffer | null): MessageAttachment | null {
    if (!strainGraph) return null;

    return new MessageAttachment(strainGraph, 'strains.png');
  }
}
