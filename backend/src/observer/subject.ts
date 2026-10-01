import type { IObserver } from "./observer.js";
import type { BookStatusChangeEvent } from "./bookStatusChangedEvent.js";

export interface ISubject {
  attach(observer: IObserver): void;
  detach(observer: IObserver): void;
  notify(event: BookStatusChangeEvent): Promise<void>;
}
