// 存储工厂 - 根据环境选择合适的存储适配器

import type { IStorageAdapter } from "./interface";
import { IndexedDBAdapter } from "./indexedDBAdapter";
import { ElectronAdapter } from "./electronAdapter";

export class StorageFactory {
  private static instance: IStorageAdapter | null = null;

  // 检测是否在 Electron 环境
  private static isElectron(): boolean {
    return !!(window as any).electronAPI;
  }

  // 获取存储适配器实例（单例）
  static getAdapter(): IStorageAdapter {
    if (!this.instance) {
      if (this.isElectron()) {
        // 本地音乐文件较大，应该始终使用文件系统存储
        this.instance = new ElectronAdapter();
        console.log("📁 使用 Electron 文件系统适配器（本地音乐）");
      } else {
        // Web 环境：使用 IndexedDB
        this.instance = new IndexedDBAdapter();
        console.log("💾 使用 IndexedDB 适配器（本地音乐）");
      }
    }
    return this.instance;
  }

  // 获取当前使用的适配器类型
  static getAdapterType(): "electron" | "indexeddb" {
    return this.isElectron() ? "electron" : "indexeddb";
  }

  // 重置实例（用于测试）
  static reset(): void {
    this.instance = null;
  }
}
