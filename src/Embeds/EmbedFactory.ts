import type { Message } from 'discord.js';
import type { CommandData } from 'cli-processor';
import { GameMode, URLGenerator } from '@kionell/osu-api';
import { IBeatmapResponse, IScoreResponse } from '@Core/REST';
import { ICommandOptions } from '@Core/Commands';

import {
  ButtonSystem,
  ButtonSystemType,
  EmbedWithPages,
} from '@Core/Embeds';

import {
  AlertButtonSystem,
  ConfirmationButtonSystem,
  OptionButtonSystem,
  PageButtonSystem,
} from './Buttons';

import {
  BeatmapEmbed,
  OsuBeatmapEmbed,
  TaikoBeatmapEmbed,
  CatchBeatmapEmbed,
  ManiaBeatmapEmbed,
  ScoreEmbed,
  OsuScoreEmbed,
  TaikoScoreEmbed,
  CatchScoreEmbed,
  ManiaScoreEmbed,
  GeneralHelpEmbed,
  CommandHelpEmbed,
  AttributesEmbed,
  OsuAttributesEmbed,
  TaikoAttributesEmbed,
  CatchAttributesEmbed,
  ManiaAttributesEmbed,
  IOutputAttributes,
} from './Views';

/**
 * An embed factory.
 */
export class EmbedFactory {
  createButtonSystem(type: ButtonSystemType, params?: number | EmbedWithPages[]): ButtonSystem {
    switch (type) {
      case ButtonSystemType.Alert:
        return new AlertButtonSystem();

      case ButtonSystemType.Confirmation:
        return new ConfirmationButtonSystem();

      case ButtonSystemType.Options:
        return new OptionButtonSystem(params as number);

      case ButtonSystemType.Pages:
        return new PageButtonSystem(params as EmbedWithPages[]);
    }

    throw new Error('Unknown button system type!');
  }

  createGeneralHelpEmbed(options: ICommandOptions): GeneralHelpEmbed {
    return new GeneralHelpEmbed(options);
  }

  createCommandHelpEmbed(data: CommandData): CommandHelpEmbed {
    return new CommandHelpEmbed(data);
  }

  createBeatmapEmbed(
    data: IBeatmapResponse,
    urlGenerator: URLGenerator,
    msg?: Message,
  ): BeatmapEmbed {
    switch (data.rulesetId) {
      case GameMode.Taiko:
        return new TaikoBeatmapEmbed(data, urlGenerator, msg);

      case GameMode.Fruits:
        return new CatchBeatmapEmbed(data, urlGenerator, msg);

      case GameMode.Mania:
        return new ManiaBeatmapEmbed(data, urlGenerator, msg);
    }

    return new OsuBeatmapEmbed(data, urlGenerator, msg);
  }

  createScoreEmbed(data: IScoreResponse, urlGenerator: URLGenerator): ScoreEmbed {
    switch (data.rulesetId) {
      case GameMode.Taiko:
        return new TaikoScoreEmbed(data, urlGenerator);

      case GameMode.Fruits:
        return new CatchScoreEmbed(data, urlGenerator);

      case GameMode.Mania:
        return new ManiaScoreEmbed(data, urlGenerator);
    }

    return new OsuScoreEmbed(data, urlGenerator);
  }

  createAttributesEmbed(data: IOutputAttributes): AttributesEmbed {
    switch (data.rulesetId) {
      case GameMode.Taiko:
        return new TaikoAttributesEmbed(data);

      case GameMode.Fruits:
        return new CatchAttributesEmbed(data);

      case GameMode.Mania:
        return new ManiaAttributesEmbed(data);
    }

    return new OsuAttributesEmbed(data);
  }
}

export default new EmbedFactory();
