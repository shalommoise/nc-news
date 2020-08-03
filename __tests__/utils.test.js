const {
  formatDates,
  makeRefObj,
  formatComments,
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
    expect(formatDates(list)).not.toBe(list);
  });
});

describe("makeRefObj", () => {});

describe("formatComments", () => {});
