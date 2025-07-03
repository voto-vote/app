export type These = {
    id: string,
    category: string,
    text: string,
    explanations: {
        startOffset: number,
        endOffset: number,
        text: string // markdown
    }[],
    additionalInfos: string // markdown
}