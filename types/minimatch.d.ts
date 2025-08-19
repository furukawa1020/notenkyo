declare module 'minimatch' {
  interface IOptions {
    debug?: boolean;
    nobrace?: boolean;
    noglobstar?: boolean;
    dot?: boolean;
    noext?: boolean;
    nocase?: boolean;
    nonull?: boolean;
    matchBase?: boolean;
    nocomment?: boolean;
    nonegate?: boolean;
    flipNegate?: boolean;
    partial?: boolean;
    allowWindowsEscape?: boolean;
  }

  interface IMinimatch {
    pattern: string;
    options: IOptions;
    set: string[][];
    regexp: RegExp | null;
    negate: boolean;
    comment: boolean;
    empty: boolean;
    
    makeRe(): RegExp | false;
    match(fname: string): boolean;
    matchOne(file: string[], pattern: string[], partial: boolean): boolean;
  }

  function minimatch(target: string, pattern: string, options?: IOptions): boolean;

  namespace minimatch {
    function filter(pattern: string, options?: IOptions): (target: string) => boolean;
    function match(list: string[], pattern: string, options?: IOptions): string[];
    function makeRe(pattern: string, options?: IOptions): RegExp | false;
    
    const Minimatch: {
      new (pattern: string, options?: IOptions): IMinimatch;
    };
  }

  export = minimatch;
}
