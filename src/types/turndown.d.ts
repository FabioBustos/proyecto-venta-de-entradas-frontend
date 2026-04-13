declare module 'turndown' {
  interface TurndownOptions {
    headingStyle?: 'atx' | 'setext';
    bulletListMarker?: '-' | '*' | '+';
    codeBlockStyle?: 'fenced' | 'indented';
    emDelimiter?: '*' | '_';
    strongDelimiter?: '**' | '__';
    linkStyle?: 'inlined' | 'referenced';
    linkReferenceStyle?: 'full' | 'collapsed' | 'shortcut';
  }

  interface TurndownRule {
    filter: string | ((node: any) => boolean);
    replacement: (content: string, node: any) => string;
  }

  class TurndownService {
    constructor(options?: TurndownOptions);
    turndown(html: string): string;
    addRule(name: string, rule: TurndownRule): this;
    use(plugin: (service: this) => void): this;
  }

  export = TurndownService;
}