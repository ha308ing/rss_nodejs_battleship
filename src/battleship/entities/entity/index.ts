import { generateIndex } from "@/battleship/utils";

export class Entity<T> {
    _entities: Map<string, T>;
    _name: string;

    constructor(name: string) {
        this._entities = new Map();
        this._name = name;
    }

    _checkIndex(index: string, toThrow = true): boolean {
        if (this._entities.has(index) == false) {
            if (toThrow) {
                throw new Error(`${this._name}. Index ${index} not found`);
            } else {
                return false;
            }
        }
        return true;
    }

    _validateItem(item: T) {
        return true;
    }

    add(item: T, index?: string): [string, T] {
        index ??= generateIndex();

        this._entities.set(index, item);

        return [index, item];
    }

    get(index: string, toThrow?: boolean): T | undefined;
    get(index: string[], toThrow?: boolean): (T | undefined)[];
    get(index: string | string[], toThrow = true) {
        if (Array.isArray(index)) {
            return index.map((i) => {
                this._checkIndex(i, toThrow);
                return this._entities.get(i);
            });
        } else {
            this._checkIndex(index, toThrow);
            return this._entities.get(index);
        }
    }

    delete(index: string): boolean;
    delete(...index: string[]): boolean[];
    delete(index: string | string[]): boolean | boolean[] {
        if (Array.isArray(index)) {
            return index
                .map((i) => {
                    this._checkIndex(i);
                    return this._entities.delete(i);
                })
                .every((result) => result === true);
        } else {
            this._checkIndex(index);
            return this._entities.delete(index);
        }
    }

    print() {
        console.log(this._entities);
    }
}