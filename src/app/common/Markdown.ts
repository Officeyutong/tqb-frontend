import showdown from "showdown";
import katex from "katex";
const htmlDecode = (input: string) => {
    let doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent || "";

};
const converter = new showdown.Converter({
    extensions: [
        {
            type: 'output', regex: /\$\$([\S\s]+?)\$\$/g, replace: (x: string, y: string) => {
                let result = katex.renderToString(htmlDecode(y), {
                    throwOnError: false,
                    displayMode: true
                });
                return result;
            }
        },
        {
            type: 'output', regex: /\$([\S\s]+?)\$/g, replace: (x: string, y: string) => {
                console.log("input=", y);
                let result = katex.renderToString(htmlDecode(y), {
                    throwOnError: false,
                    displayMode: false
                });
                return result;
            }
        }
    ],
    tables: true,
    literalMidWordUnderscores: true,
    strikethrough: true
});

export { converter };