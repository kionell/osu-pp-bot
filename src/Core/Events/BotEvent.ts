/**
 * A discord bot event.
 */
export abstract class BotEvent {
  /**
   * The event name.
   */
  name: string;

  /**
   * Should this event be invoked only once?
   */
  once: boolean;

  /**
   * Creates a new instance of an event.
   * @constructor
   */
  constructor(options?: Partial<BotEvent>) {
    this.name = options?.name ?? '';
    this.once = options?.once ?? false;
    this.handle = options?.handle ?? this.handle;
  }

  /**
   * The event handler.
   */
  handle(...args: any[]): any {
    return args;
  }
}
