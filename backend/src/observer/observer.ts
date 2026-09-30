import type { BookStatusChangeEvent } from "./bookStatusChangedEvent.js";
export interface IObserver {
  update(event: BookStatusChangeEvent): Promise<void>;
}
