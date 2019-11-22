import { LineWidthChunker, partition } from './Pager';

describe('partition', () => {

    it('test', () => {
        const a = [114, 8, 18];
        expect(partition(a, 1)).toEqual([a]);

        const b = [150, 32, 118, 33, 36, 33, 61, 0];
        expect(partition(b, 3)).toEqual([[150], [32, 118], [33, 36, 33, 61, 0]]);
    });

});

describe('LineWidthChunker', () => {

    function makeTokens(texts, widths) {
        const result = [];
        let offsetLeft = 0;
        for (let i = 0; i < texts.length; i++) {
            result.push({
                // Mock the properties of HTMLElement used in the code
                innerText: texts[i],
                innerHTML: texts[i],
                offsetLeft: offsetLeft,
                offsetWidth: widths[i],
            });
            offsetLeft += widths[i];
        }
        return result;
    }

    it('enforces the maximum chunk width', () => {
        const c = new LineWidthChunker(150, 160);
        const l = makeTokens(
            ["This", " ", "is", " ", "a", " ", "first", " ", "test"],
            [  100 , 10 ,  20 , 10 , 20 , 10 ,     80 , 10 ,    60 ]);
        expect(c.chunkize(l)).toEqual([
                "This is a", " ", "first test",
        ]);
    });

});