import katex from "katex";
import "katex/contrib/mhchem/mhchem";


const renderKatex = (tex,displaymode) => {
    return katex.renderToString(tex,{
        throwOnError:true,
        displayMode:displaymode,
    });
};

export { renderKatex };