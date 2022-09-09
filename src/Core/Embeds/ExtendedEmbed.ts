import {
  EmbedField,
  HexColorString,
  MessageEmbed,
  MessageEmbedAuthor,
  MessageEmbedFooter,
  MessageEmbedImage,
  MessageEmbedThumbnail,
} from 'discord.js';

import { Color } from './Enums';

export abstract class ExtendedEmbed extends MessageEmbed {
  protected _imageURL?: string;

  async build(): Promise<this> {
    this.title = this._createEmbedTitle();
    this.url = this._createEmbedURL();
    this.description = this._createEmbedDescription();
    this.author = this._createEmbedAuthor();
    this.thumbnail = this._createEmbedThumbnail();
    this.fields = this._createEmbedFields();
    this.image = this._createEmbedImage();
    this.footer = this._createEmbedFooter();
    this.color = this._getEmbedColor();

    return this;
  }

  setCustomImageURL(url?: string): void {
    this._imageURL = url;
  }

  protected _getEmbedColor(): number {
    const color = this._hexColor.replace('#', '') ?? null;

    return color !== null ? parseInt(color, 16) : 0;
  }

  protected _createEmbedTitle(): string | null {
    return null;
  }

  protected _createEmbedURL(): string | null {
    return null;
  }

  protected _createEmbedDescription(): string | null {
    return null;
  }

  protected _createEmbedAuthor(): MessageEmbedAuthor | null {
    return null;
  }

  protected _createEmbedThumbnail(): MessageEmbedThumbnail | null {
    return null;
  }

  protected _createEmbedFields(): EmbedField[] {
    return [];
  }

  protected _createEmbedImage(): MessageEmbedImage | null {
    if (!this._imageURL) return null;

    return {
      url: this._imageURL,
    };
  }

  protected _createEmbedFooter(): MessageEmbedFooter | null {
    return null;
  }

  protected get _hexColor(): HexColorString {
    return Color.Default;
  }
}
