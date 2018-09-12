export interface CacheType<Key, Value> {
  get(key: Key): Value | void
  set(key: Key, value: Value): void
  remove(key: Key): boolean
  clear(): void
  size(): number
  empty(): boolean
  full(): boolean
  hits(): Hits
  hasKey(key: Key): boolean
}

export interface Item<Value> {
  value: Value
}

export interface Hits {
  count: number
  rate: number
}

export class Cache<K, V> implements CacheType<K, V> {
  private _cache = new Map<K, Item<V>>();
  private _cacheLast = new Map<K, Item<V>>();
  private _size: number = 0;
  private _hitCount: number = 0;
  private _missCount: number = 0;

  public static create<Key, Value>(limit: number) {
    return new Cache<Key, Value>(limit);
  }

  constructor(private _limit: number) {}

  public get(key: K): V | void {
    let item: Item<V> | undefined = this._cache.get(key);
    if (item) {
      this._hitCount ++;
      return item.value;
    }

    item = this._cacheLast.get(key);
    if (item) {
      this._hitCount ++;
      this._updateCache(key, item);
      return item.value;
    }

    this._missCount ++;
  }

  public set(key: K, value: V) {
    const item = this._cache.get(key);
    if (item) {
      item.value = value
    } else {
      this._updateCache(key, { value });
    }
  }

  public remove(key: K): boolean {
    let canRemove = false;
    if (this._cache.has(key)) {
      canRemove = true;
      this._cache.delete(key);
    } else if (this._cacheLast.has(key)) {
      canRemove = true;
      this._cacheLast.delete(key);
    }

    return canRemove;
  }

  public clear(): void {
    this._size = 0;
    this._cache.clear();
    this._cacheLast.clear();
  }

  public size(): number {
    return this._size;
  }

  public hits(): Hits {
    return {
      count: this._hitCount,
      rate: this._hitCount / (this._hitCount + this._missCount),
    };
  }

  public hasKey(key: K): boolean {
    return this._cache.has(key) || this._cacheLast.has(key);
  }

  public empty(): boolean {
    return this._size === 0;
  }

  public full(): boolean {
    return this._size === this._limit;
  }

  private _updateCache(key: K, item: Item<V>) {
    this._cache.set(key, item);
    this._size++;
    if (this._size >= this._limit) {
      this._size = this._limit;
      this._cacheLast = this._cache;
      this._cache = new Map<K, Item<V>>();
    }
  }
}

export default Cache;