import { Action, Callback } from '../types/leaky-bucket.types';

export class LeakyBucketQueue {
    private queue: Array<{
        action: Action;
        args: Array<unknown>;
        callback: Callback;
    }> = [];
    private interval: NodeJS.Timeout | null = null;
    private readonly intervalMs: number;

    constructor(rateLimit: number) {
        this.intervalMs = Math.ceil(1000 / rateLimit);
    }

    private execNext() {
        if (this.queue.length === 0) {
            if (this.interval) {
                clearInterval(this.interval);
                this.interval = null;
            }
            return;
        }

        const next = this.queue.shift();
        if (!next) return;

        const { action, args, callback } = next;

        try {
            const result = action(...args);

            if (result instanceof Promise) {
                result.then((data) => callback(null, data)).catch((err) => callback(err));
            } else {
                callback(null, result);
            }
        } catch (err) {
            callback(err as Error);
        }
    }

    public enqueue<T, A extends Array<unknown>>(action: Action<T, A>, args: A, callback: Callback<T>) {
        this.queue.push({
            action: action as Action<unknown, Array<unknown>>,
            args,
            callback: callback as Callback<unknown>,
        });

        if (!this.interval) {
            this.interval = setInterval(() => this.execNext(), this.intervalMs);
        }
    }

    public async execute<T, A extends Array<unknown>>(
        action: Action<T, A>,
        ...args: A
    ): Promise<[Error | null, T | null]> {
        return new Promise<[Error | null, T | null]>((resolve) => {
            this.enqueue(action, args, (err, data) => {
                if (err) {
                    resolve([err, null]);
                } else {
                    resolve([null, data as T]);
                }
            });
        });
    }
}
