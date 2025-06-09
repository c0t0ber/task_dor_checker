import { describe, it, expect } from "vitest";
import { foo } from "./foo";

describe("foo unit test", () => {
  it("should return foo", () => {
    expect(foo()).toBe("foo");
  });
});
