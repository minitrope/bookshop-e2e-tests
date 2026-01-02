import {test} from "@playwright/test";

export default function step(label?: string) {
    return function stepDecorator(originalMethod: (...args: any[]) => any, context: ClassMethodDecoratorContext) {
        return async function replacementMethod(this: any, ...args: any[]) {
            const name = label ?? String(context.name);
            return test.step(name, async () => {
                return await originalMethod.apply(this, args);
            });
        }
    }
}