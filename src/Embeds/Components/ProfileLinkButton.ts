import { MessageButton, MessageButtonStyle } from 'discord.js';

export class ProfileLinkButton extends MessageButton {
  /**
   * The ID of the profile link button.
   */
  customId = 'profileLinkButton';

  /**
   * The label of the profile link button.
   */
  label = 'Link profile!';

  /**
   * The style of the profile link button.
   */
  style: MessageButtonStyle = 'LINK';
}
