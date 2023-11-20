function newLineToSpace(str: string): string {
    return str.replace(/\s+/g, " ");
}

function classNames(...arg: any[]): string {
    const stringArray = [];
    for (let i = 0; i < arg.length; i++) {
        const item = arg[i];
        if (typeof item === "string" && item.trim() !== "") {
            stringArray.push(item.trim());
        } else if (Array.isArray(item)) {
            if (item.length) {
                stringArray.push(classNames(...item));
            }
        } else if (typeof item === "object" && item.toString === Object.prototype.toString) {
            for (const key in item) {
                if (item[key] && key.trim() !== "") {
                    stringArray.push(key.trim());
                }
            }
        }
    }
    return newLineToSpace(stringArray.join(" "));
}

export default classNames;
