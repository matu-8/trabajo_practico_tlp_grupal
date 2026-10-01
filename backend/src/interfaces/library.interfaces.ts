
export interface IObserver {
 update():void
}

export interface IBook {
  attach(): void
  detach(): void
  notify(): void
}
