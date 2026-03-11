import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IndexedDbService {

  private dbName = 'app-db';
  private db!: IDBDatabase;

  private stores = ['categories', 'transactions'];

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {

      const request = indexedDB.open(this.dbName, 1);

      request.onupgradeneeded = (event: any) => {

        const db = event.target.result;

        this.stores.forEach(store => {

          if (!db.objectStoreNames.contains(store)) {

            db.createObjectStore(store, {
              keyPath: 'id',
              autoIncrement: true
            });

          }

        });

      };

      request.onsuccess = (event: any) => {
        this.db = event.target.result;
        resolve();
      };

      request.onerror = () => reject();

    });
  }

  add(storeName: string, item: any): Promise<any> {

    return new Promise((resolve, reject) => {

      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);

      const request = store.add(item);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject();

    });

  }

  getAll(storeName: string): Promise<any[]> {

    return new Promise((resolve, reject) => {

      const tx = this.db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);

      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject();

    });

  }

  delete(storeName: string, id: number): Promise<void> {

    return new Promise((resolve, reject) => {

      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);

      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject();

    });

  }

  update(storeName: string, item: any): Promise<void> {

    return new Promise((resolve, reject) => {

      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);

      const request = store.put(item);

      request.onsuccess = () => resolve();
      request.onerror = () => reject();

    });

  }

}