const {
  formatDates,
  makeRefObj,
  formatComments,
  changeDateToSQLFrom,
  removeApostraphe, 
  addApostraphe
} = require("../db/utils/utils");

describe("formatDates", () => {
  it("returns an empty array when list is empty", () => {
    const list = [];
    expect(formatDates(list)).toEqual([]);
  });
  it("returns an array with one object with the timestamp changed to javascript form", () => {
    const list = [
      {
        created_at: 1471522072389,
      },
    ];
   
    expect(formatDates(list)[0].created_at).toBeInstanceOf(Date);
  });
  it("returns an array with multiple object with the timestamp changed to javascript form", () => {
    const list = [
      {
        created_at: 1471522072389,
      },
      {
        created_at: 1471522123456,
      },
    ];
    expect(formatDates(list)[0].created_at).toBeInstanceOf(Date);
    expect(formatDates(list)[1].created_at).toBeInstanceOf(Date);
  });
  it("Does not mutate input", () => {
    const list = [
      {
        something: "else",
        created_at: 1471522072389,
      },
      {
        created_at: 1471522123456,
      },
    ];
    formatDates(list);
    expect(list).toEqual([
      {
        something: "else",
        created_at: 1471522072389,
      },
      {
        created_at: 1471522123456,
      },
    ]);
  });
});

describe("makeRefObj", () => {
  it("return an empty object for an empty array", () => {
    expect(makeRefObj([])).toEqual({});
  });
  it("returns one item object with correct formatting from one itemed array", () => {
    const input = [
      {
        article_id: 1,
        title: "man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100,
      },
    ];
    const output = { man: 1 };
    expect(makeRefObj(input)).toEqual(output);
  });

  it("works for multiple itemed array", () => {
    const input = [
      {
        article_id: 1,
        title: "man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100,
      },
      { article_id: 2, title: "woman" },
      {
        article_id: 3,
        title: "child",
      },
    ];
    const output = { man: 1, woman: 2, child: 3 };
    expect(makeRefObj(input)).toEqual(output);
  });
  it("Does not mutate original array", () => {
    const input = [{ article_id: 2, title: "woman" }];
    expect(makeRefObj(input)).toEqual({ woman: 2 });
  });
});

describe("formatComments", () => {
  it("returns an empty array", () => {
    expect(formatComments([])).toEqual([]);
  });
  it("Changes created_at and time to correct format", () => {
    const comment = [
      {
        body: "T.",
        belongs_to: "Living in the shadow",
        created_by: "butter_bridge",
        votes: 14,
      },
    ];
    const articleRef = { ["Living in the shadow"]: 2 };
    const formatted = formatComments(comment, articleRef);
    const expectedOutput = [
      {
        body: "T.",
        article_id: 2,
        author: "butter_bridge",
        votes: 14,
      },
    ];
    expect(formatted).toEqual(expectedOutput);
  });
  it("Works for multiple objects", () => {
    const comment = [
      {
        body: "T.",
        belongs_to: "Living in the shadow",
        created_by: "butter_bridge",
        votes: 14,
      },
      {
        body: "test",
        belongs_to: "shadow",
        created_by: "shalom",
        votes: 0,
      },
    ];
    const articleRef = { ["Living in the shadow"]: 2, ["shadow"]: 3 };
    const expectedOutput = [
      {
        body: "T.",
        article_id: 2,
        author: "butter_bridge",
        votes: 14,
      },
      {
        body: "test",
        article_id: 3,
        author: "shalom",
        votes: 0,
      },
    ];
    const formatted = formatComments(comment, articleRef);
    expect(formatted).toEqual(expectedOutput);
  });
});
describe("changeDateToSQLFrom()", ()=>{
  test('returns empty str when input is empty', () => {
    expect(changeDateToSQLFrom('')).toBe('');
  });
  test('return str to SQL from', ()=>{
            // '2018-11-15T12:21:54.171Z'
    const sqlDate = '2018-11-15 12:21:54.171';
    const currentDate =   formatDates([{ created_at: 1542284514171}])[0].created_at;
    
    expect(changeDateToSQLFrom(currentDate)).toBe(sqlDate)
  })
})

describe.only("removeApostraphe", ()=>{
  test('Empty strings returns empty string', () => {
    expect(removeApostraphe()).toBe('');
    expect(removeApostraphe('')).toBe('');
    expect(removeApostraphe([])).toBe('');
    expect(removeApostraphe({})).toBe('');
  });
  test('String with no apostaphe does not change', ()=>{
    const text = "Many people know Watson as the IBM-developed cognitive super computer that won the Jeopardy! gameshow in 2011. In truth, Watson is not actually a computer but a set of algorithms and APIs, and since winning TV fame (and a $1 million prize) IBM has put it to use tackling tough problems in every industry from healthcare to finance. Most recently, IBM has announced several new partnerships which aim to take things even further, and put its cognitive capabilities to use solving a whole new range of problems around the world."
    expect(removeApostraphe(text)).toBe(text);
  })
  test('String replaces apostraphe', () => {
     const text = "will This work. I don't know, we'll see.";
     const newText = "will This work. I don\"t know, we\"ll see.";
     expect(removeApostraphe(text)).toBe(newText);
  });
})

describe.only("addApostraphe", ()=>{
   test('Empty strings returns empty string', () => {
    expect(addApostraphe()).toBe('');
    expect(addApostraphe('')).toBe('');
    expect(addApostraphe([])).toBe('');
    expect(addApostraphe({})).toBe('');
  });
   test('String with no apostaphe does not change', ()=>{
    const text = "Many people know Watson as the IBM-developed cognitive super computer that won the Jeopardy! gameshow in 2011. In truth, Watson is not actually a computer but a set of algorithms and APIs, and since winning TV fame (and a $1 million prize) IBM has put it to use tackling tough problems in every industry from healthcare to finance. Most recently, IBM has announced several new partnerships which aim to take things even further, and put its cognitive capabilities to use solving a whole new range of problems around the world."
    expect(addApostraphe(text)).toBe(text);
  });
  test('String replaces apostraphe', () => {
     
     const text = "will This work. I don\"t know, we\"ll see.";
     const newText = "will This work. I don't know, we'll see.";
     expect(addApostraphe(text)).toBe(newText);
  });
})