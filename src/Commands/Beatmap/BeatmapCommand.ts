import { MessageAttachment } from 'discord.js';
import { Argument, IHasArgument } from 'cli-processor';
import { APIFactory, getRulesetId, getServerName, URLScanner } from '@kionell/osu-api';
import { BotCommand, CommandAttachments, AttachmentType, ICommandOptions, IHasAttachments, Category } from '@Core/Commands';
import { IBeatmapOptionsDto, RESTClient } from '@Core/REST';
import { EmbedShipment } from '@Core/Embeds';
import { getBeatmapIdFromMessage } from '@Core/Utils';
import { ModsFlag, RulesetFlag, SearchFlag, ServerFlag } from '@Flags';
import { EmbedFactory } from '@Embeds';

export class BeatmapCommand extends BotCommand implements IHasAttachments, IHasArgument {
  name = 'beatmap';

  aliases = [
    'map', 'm', 'b',
  ];

  examples = [
    `${this.name} 1626530 --${ModsFlag.examples[0]} --${RulesetFlag.examples[0]}`,
    `${this.name} --${RulesetFlag.examples[3]} +ezhtnf`,
    `${this.name} --${SearchFlag.examples[2]}`,
    `${this.name} https://osu.ppy.sh/beatmapsets/773801#osu/1626530`,
    'https://old.ppy.sh/b/3456523?m=3 +dt',
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

  arg = new Argument<string>({
    description: 'ID or URL',
    isRequired: false,
    minLength: 1,
  });

  category = Category.Osu;

  /**
   * Attachments of this command.
   */
  attachments: CommandAttachments = new CommandAttachments();

  constructor() {
    super();

    this.registerFlag(new ModsFlag());
    this.registerFlag(new RulesetFlag());
    this.registerFlag(new SearchFlag());
    this.registerFlag(new ServerFlag());
  }

  async execute(options: ICommandOptions): Promise<void> {
    const targetServer = this._getTargetServer();
    const generator = APIFactory.createURLGenerator(targetServer);

    const dto = this._getBeatmapDto(options);
    const beatmap = await RESTClient.calculateBeatmap(dto);
    const strainGraph = await RESTClient.getBeatmapGraph(beatmap.graphFile);
    const graphAttachment = this._createGraphAttachment(strainGraph);

    const embed = EmbedFactory.createBeatmapEmbed(beatmap, generator);

    const shipment = new EmbedShipment(options.msg);

    await shipment
      .embeds(await embed.build())
      .attachments(graphAttachment)
      .send();
  }

  protected _getBeatmapDto(options: ICommandOptions): IBeatmapOptionsDto {
    const dto: IBeatmapOptionsDto = {};

    const targetServer = this._getTargetServer();
    const scanner = APIFactory.createURLScanner(targetServer);

    if (typeof targetServer === 'string') {
      dto.server = targetServer;
    }

    const targetBeatmap = this._getTargetBeatmap(scanner, options);

    if (typeof targetBeatmap === 'number' && targetBeatmap) {
      dto.beatmapId = targetBeatmap;
    }

    const targetRuleset = this._getTargetRuleset(scanner);

    if (typeof targetRuleset === 'number') {
      dto.rulesetId = targetRuleset;
    }

    const targetSearch = this.getFlagValue(SearchFlag);

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

    const targetMods = this.getFlagValueOrDefault(ModsFlag);
    const modsNumber = Number(targetMods);

    dto.mods = !isNaN(modsNumber) ? modsNumber : targetMods;

    return dto;
  }

  protected _getTargetBeatmap(scanner: URLScanner, options: ICommandOptions): number | null {
    const targetBeatmap = this.getValue(this.arg);

    const raw = targetBeatmap?.length ? Number(targetBeatmap) : null;
    const scanned = getBeatmapIdFromMessage(scanner, options.msg);

    return raw || scanned || options.channel.beatmapId;
  }

  protected _getTargetServer(): ReturnType<typeof getServerName> {
    const targetBeatmap = this.getValue(this.arg);

    return this.getFlagValue(ServerFlag) ?? getServerName(targetBeatmap);
  }

  protected _getTargetRuleset(scanner: URLScanner): number | null {
    const targetBeatmap = this.getValue(this.arg);
    const targetRuleset = this.getFlagValue(RulesetFlag);

    const scanned = scanner.getRulesetIdFromURL(targetBeatmap);
    const input = Number(targetRuleset) || targetRuleset || scanned;

    if (typeof input === 'number' || typeof input === 'string') {
      return getRulesetId(input);
    }

    return null;
  }

  protected _createGraphAttachment(strainGraph: Buffer | null): MessageAttachment | null {
    if (!strainGraph) return null;

    return new MessageAttachment(strainGraph, 'strains.png');
  }
}
