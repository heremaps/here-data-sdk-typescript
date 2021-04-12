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

export type Listener<T> = (event: T) => any;

export class TypedEvent<T> {
    private listeners: Listener<T>[] = [];

    on = (
        listener: Listener<T>
    ): {
        dispose: () => void;
    } => {
        this.listeners.push(listener);
        return {
            dispose: () => {
                this.off(listener);
            }
        };
    };

    off = (listener: Listener<T>) => {
        const callbackIndex = this.listeners.indexOf(listener);
        if (callbackIndex > -1) {
            this.listeners.splice(callbackIndex, 1);
        }
    };

    emit = (event: T) => {
        this.listeners.forEach(listener => listener(event));
    };
}
