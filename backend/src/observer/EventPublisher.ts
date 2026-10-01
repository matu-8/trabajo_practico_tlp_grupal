import type { ISubject } from "./subject.js";
import type { IObserver } from "./observer.js";
import type { BookStatusChangeEvent } from "./bookStatusChangedEvent.js";

export class EventPublisher implements ISubject {
  // La lista de los que escuchan
  private observers: IObserver[] = [];

  // Agregar un observer (sin repetirlo)
  attach(observer: IObserver): void {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
    }
  }

  // Sacar un observer
  detach(observer: IObserver): void {
    this.observers = this.observers.filter((o) => o !== observer);
  }

  // Avisarle a todos
  async notify(event: BookStatusChangeEvent): Promise<void> {
    for (const observer of this.observers) {
      await observer.update(event);
    }
  }
}
