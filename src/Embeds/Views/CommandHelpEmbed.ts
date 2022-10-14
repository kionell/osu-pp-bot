import { CommandData, ICommand, IFlag, IOption, OptionType } from 'cli-processor';
import { EmbedField, MessageEmbedAuthor } from 'discord.js';
import { ExtendedEmbed, getCategoryIconURL } from '@Core/Embeds';
import { BotCommand } from '@Core/Commands';

export class CommandHelpEmbed extends ExtendedEmbed {
  protected _commandData: CommandData;
  protected _command: BotCommand | null;

  constructor(commandData: CommandData) {
    super();

    this._commandData = commandData;
    this._command = commandData.tree.last as BotCommand;
  }

  protected _createEmbedAuthor(): MessageEmbedAuthor | null {
    if (!this._command) return null;

    return {
      name: this._command.title,
      iconURL: getCategoryIconURL(this._command.category),
    };
  }

  protected _createEmbedDescription(): string | null {
    return this._command?.description ?? null;
  }

  protected _createEmbedFields(): EmbedField[] {
    const args = this._command?.options.filter((o) => o.type === OptionType.Argument);
    const flags = this._command?.options?.filter((o) => o.type === OptionType.Flag);

    const fields = [
      this._createUsageField(args as IOption[]),
    ];

    if (this._command?.subcommands.size) {
      fields.push(this._createSubcommandsField());
    }

    if (typeof flags !== 'undefined' && flags.length) {
      fields.push(...this._createFlagsFields(flags as IFlag[]));
    }

    if (this._command?.examples.length) {
      fields.push(this._createExamplesField());
    }

    if (this._command?.aliases.length) {
      fields.push(this._createAliasesField());
    }

    return fields;
  }

  protected _createUsageField(args: IOption[]): EmbedField {
    const template = [
      this._command?.name ?? '',
    ];

    if (this._command?.subcommands.size) {
      template.push('<subcommand>');
    }

    args?.forEach((arg) => {
      template.push(this._stringifyArg(arg));
    });

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

  protected _createFlagsFields(flags: IFlag[]): EmbedField[] {
    const fields: EmbedField[] = [];

    let template: string[] = [];
    let templateLength = 0;

    const MAX_FIELD_LENGTH = 1024;

    // Temprorary fix for embed field overflow.
    const addFlagField = () => {
      const fieldName = '**[Flags]**';
      const fieldValue = template.join('\n');

      const field = this._createField(fieldName, fieldValue);

      fields.push(field);

      template = [];
      templateLength = 0;
    };

    flags.forEach((flag) => {
      const stringifiedFlag = this._stringifyFlag(flag);

      // TODO: This should be replaced with discord components.
      if (templateLength + stringifiedFlag.length >= MAX_FIELD_LENGTH) {
        addFlagField();
      }

      template.push(stringifiedFlag);
      templateLength += stringifiedFlag.length;
    });

    addFlagField();

    return fields;
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
    const short = flag.shortPrefix + flag.shortName;
    const full = flag.prefix + flag.name;
    const separator = flag.separator;
    const arg = this._stringifyArg(flag);

    return `\`${short}|${full}${separator}${arg}\` - ${flag.description}`;
  }

  protected _stringifyArg(arg: IOption): string {
    return [
      arg.isRequired ? '<' : '[',
      arg.expected,
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
