/*
 * Copyright (C) 2021 HERE Europe B.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 * License-Filename: LICENSE
 */

/**
 * The event handler function.
 */
export type Listener<T> = (event: T) => any;

/**
 * The simple implementation of Event Emmiter with types.
 */
export class TypedEvent<T> {
    private listeners: Listener<T>[] = [];

    /**
     * Adds the `listener` function to the end of the array of listeners for the event.
     * No checks are made to see if the listener has already been added.
     * Multiple calls passing the listener can result in it being added
     * and called multiple times.
     *
     * @param listener The event handler function.
     *
     * @returns A callback for removing the added listener.
     */
    on(listener: Listener<T>): { dispose: () => void } {
        this.listeners.push(listener);
        return {
            dispose: () => {
                this.off(listener);
            }
        };
    }

    /**
     * Removes the specified listener from the listener array for the event.
     *
     * @param listener The event handler function.
     */
    off(listener: Listener<T>) {
        const callbackIndex = this.listeners.indexOf(listener);
        if (callbackIndex > -1) {
            this.listeners.splice(callbackIndex, 1);
        }
    }

    /**
     * Calls each of the listeners synchronously in the order in which
     * they were registered, passing the supplied argument to each.
     *
     * @param event The `Event` object.
     */
    emit(event: T) {
        this.listeners.forEach(listener => listener(event));
    }
}
