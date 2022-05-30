import { CommandData, IArgument, ICommand, IFlag, IHasArgument } from 'cli-processor';
import { EmbedField } from 'discord.js';
import { BotCommand } from '@Core/Commands';
import { ExtendedEmbed } from '@Core/Embeds';

export class CommandHelpEmbed extends ExtendedEmbed {
  protected _commandData: CommandData;
  protected _command: BotCommand | null;

  constructor(commandData: CommandData) {
    super();

    this._commandData = commandData;
    this._command = commandData.tree.last as BotCommand;
  }

  protected _createEmbedTitle(): string | null {
    return this._command?.title ?? null;
  }

  protected _createEmbedDescription(): string | null {
    return this._command?.description ?? null;
  }

  protected _createEmbedFields(): EmbedField[] {
    const fields = [
      this._createUsageField(),
    ];

    if (this._command?.subcommands.size) {
      fields.push(this._createSubcommandsField());
    }

    if (this._command?.flags.size) {
      fields.push(this._createFlagsField());
    }

    if (this._command?.examples.length) {
      fields.push(this._createExamplesField());
    }

    if (this._command?.aliases.length) {
      fields.push(this._createAliasesField());
    }

    return fields;
  }

  protected _createUsageField(): EmbedField {
    const template = [
      this._command?.name ?? '',
    ];

    if (this._command?.subcommands.size) {
      template.push('<subcommand>');
    }

    template.push(this._stringifyArg(this._commandData.arg));

    const usage = '```' + template.join(' ') + '```';

    return this._createField('**[Usage]**', usage);
  }

  protected _createSubcommandsField(): EmbedField {
    const subcommands: string[] = [];

    this._command?.subcommands.forEach((subcommand) => {
      subcommands.push(this._stringifySubcommand(subcommand));
    });

    return this._createField('**[Subcommands]**', subcommands.join('\n'));
  }

  protected _createFlagsField(): EmbedField {
    const flags: string[] = [];

    this._command?.flags.forEach((flag) => {
      flags.push(this._stringifyFlag(flag));
    });

    return this._createField('**[Flags]**', flags.join('\n'));
  }

  protected _createExamplesField(): EmbedField {
    const examples = this._command?.examples.map((e) => `\`${e}\``);

    return this._createField('**[Examples]**', examples?.join('\n') ?? '');
  }

  protected _createAliasesField(): EmbedField {
    const aliases = this._command?.aliases.map((a) => `\`${a}\``);

    return this._createField('**[Aliases]**', aliases?.join(', ') ?? '');
  }

  protected _stringifySubcommand(subcommand: ICommand): string {
    return `\`${subcommand.name}\` - ${subcommand.description}`;
  }

  protected _stringifyFlag(flag: IFlag): string {
    const flagWithArg = flag as IFlag & IHasArgument;

    const short = flag.shortPrefix + flag.shortName;
    const full = flag.prefix + flag.name;
    const arg = this._stringifyArg(flagWithArg.arg);

    return `\`${short}|${full} ${arg}\` - ${flag.description}`;
  }

  protected _stringifyArg(arg: IArgument | null): string {
    if (!arg) return '';

    return [
      arg.isRequired ? '<' : '[',
      arg.description,
      arg.isRequired ? '>' : ']',
    ].join('');
  }

  protected _createField(name: string, value: string): EmbedField {
    return {
      name,
      value,
      inline: false,
    };
  }
}
