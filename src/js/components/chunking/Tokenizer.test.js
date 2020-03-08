import Tokenizer from './Tokenizer';

it('split words according to spaces', () => {
    const t = new Tokenizer();
    const tokens = t.tokenize("Ceci est un test");
    expect(tokens.length).toBe(7);
    expect(tokens).toEqual([
        { token: "Ceci", type: "word"  },
        { token: " ",    type: "space" },
        { token: "est",  type: "word"  },
        { token: " ",    type: "space" },
        { token: "un",   type: "word"  },
        { token: " ",    type: "space" },
        { token: "test", type: "word"  },
    ]);
});

it('split words according to en dashes', () => {
    const t = new Tokenizer();
    const tokens = t.tokenize("Web framework--React, Angular--are popular");
    expect(tokens).toEqual([
        { token: "Web",       type: "word"  },
        { token: " ",         type: "space" },
        { token: "framework", type: "word"  },
        { token: "--React,",  type: "word"  },
        { token: " ",         type: "space" },
        { token: "Angular",   type: "word"  },
        { token: "--are",     type: "word"  },
        { token: " ",         type: "space" },
        { token: "popular",   type: "word"  },
    ]);
});