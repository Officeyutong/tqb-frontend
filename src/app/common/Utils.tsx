import React, { useEffect, useState, useCallback } from "react";
import { InputOnChangeData } from "semantic-ui-react";

const wrapDocumentTitle = (title: string) => {
    return `${title} - 退群杯`;
};

const useDocumentTitle: (title: string) => void = (title: string) => {
    useEffect(() => {
        document.title = wrapDocumentTitle(title);
        return () => { document.title = "退群杯" };
    }, [title]);
};
type onChangeType = ((event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => void);

const useInputValue: (text?: string) => { value: string; onChange: onChangeType } = (text: string = "") => {
    const [value, setValue] = useState(text);
    let onChange: onChangeType = useCallback((_, d) => {
        setValue(d.value);
    }, []);
    return { value, onChange };
};

export {
    useDocumentTitle,
    useInputValue,
    wrapDocumentTitle
};