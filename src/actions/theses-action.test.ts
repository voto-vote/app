import { describe, it, expect } from "vitest";
import { parseThesisText } from "./theses-action";

describe("parseThesisText", () => {
    it("replaces {title} and {location} placeholders", async () => {
        const input = "Election: {title} in {location}";
        const result = await parseThesisText(input, "General Election", "Berlin");
        expect(result.text).toBe("Election: General Election in Berlin");
        expect(result.explanations).toEqual([]);
    });

    it("extracts explanations and replaces text", async () => {
        const input = "This is a (thesis)[explanation].";
        const result = await parseThesisText(input, "Title", "Location");
        expect(result.text).toBe("This is a thesis.");
        expect(result.explanations.length).toBe(1);
        expect(result.explanations[0].text).toBe("explanation");
        expect(result.explanations[0].startOffset).toBe(10);
        expect(result.explanations[0].endOffset).toBe(16);
    });

    it("handles multiple explanations", async () => {
        const input = "First (one)[exp1], then (two)[exp2].";
        const result = await parseThesisText(input, "Title", "Location");
        expect(result.text).toBe("First one, then two.");
        expect(result.explanations.length).toBe(2);
        expect(result.explanations[0].text).toBe("exp1");
        expect(result.explanations[0].startOffset).toBe(6);
        expect(result.explanations[0].endOffset).toBe(9);
        expect(result.explanations[1].text).toBe("exp2");
        expect(result.explanations[1].startOffset).toBe(24);
        expect(result.explanations[1].endOffset).toBe(27);
    });

    it("returns empty explanations if no matches", async () => {
        const input = "No explanations here.";
        const result = await parseThesisText(input, "Title", "Location");
        expect(result.text).toBe("No explanations here.");
        expect(result.explanations).toEqual([]);
    });

    it("trims explanation and thesis text", async () => {
        const input = "A (  thesis  )[  explanation  ]!";
        const result = await parseThesisText(input, "Title", "Location");
        expect(result.text).toBe("A thesis!");
        expect(result.explanations[0].text).toBe("explanation");
    });
});