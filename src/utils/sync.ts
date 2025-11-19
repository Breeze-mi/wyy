/**
 * 跨标签页数据同步工具
 * 支持同域和跨域场景的多标签页数据同步
 *
 * 同域场景：使用 BroadcastChannel API 或 localStorage 事件
 * 跨域场景：需要配合后端 WebSocket 或使用 SharedWorker
 */

type SyncMessage = {
  type: "store-update";
  storeName: string;
  data: any;
  timestamp: number;
  tabId: string;
};

type SyncCallback = (data: any) => void;

class TabSync {
  private channel: BroadcastChannel | null = null;
  private tabId: string;
  private callbacks: Map<string, Set<SyncCallback>> = new Map();
  private storageListener: ((e: StorageEvent) => void) | null = null;
  private messageListener: ((e: MessageEvent) => void) | null = null;
  private lastBroadcastTime: Map<string, number> = new Map();
  private readonly THROTTLE_MS = 100; // 节流时间

  constructor() {
    this.tabId = `tab-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 11)}`;
    this.init();
  }

  private init() {
    // 1. 优先使用 BroadcastChannel（同域，性能最好）
    if (typeof BroadcastChannel !== "undefined") {
      try {
        this.channel = new BroadcastChannel("music-player-sync");
        this.channel.onmessage = (event) => {
          this.handleMessage(event.data);
        };
        console.log("✓ 跨标签页同步已启用 (BroadcastChannel)");
      } catch (error) {
        console.warn("BroadcastChannel 初始化失败，使用降级方案:", error);
        this.initFallback();
      }
    } else {
      this.initFallback();
    }

    // 2. 同时监听 postMessage（支持 iframe 跨域通信）
    this.initPostMessage();
  }

  private initFallback() {
    // 使用 localStorage 的 storage 事件作为降级方案（同域）
    this.storageListener = (e: StorageEvent) => {
      if (e.key === "music-player-sync-message" && e.newValue) {
        try {
          const message: SyncMessage = JSON.parse(e.newValue);
          // 忽略自己发送的消息
          if (message.tabId !== this.tabId) {
            this.handleMessage(message);
          }
        } catch (error) {
          console.error("解析同步消息失败:", error);
        }
      }
    };
    window.addEventListener("storage", this.storageListener);
    console.log("✓ 跨标签页同步已启用 (localStorage)");
  }

  private initPostMessage() {
    // 监听 postMessage（用于跨域 iframe 通信）
    this.messageListener = (e: MessageEvent) => {
      // 验证消息来源（可以根据需要添加域名白名单）
      if (e.data && e.data.source === "music-player-sync") {
        const message: SyncMessage = e.data.message;
        if (message.tabId !== this.tabId) {
          this.handleMessage(message);
        }
      }
    };
    window.addEventListener("message", this.messageListener);
  }

  private handleMessage(message: SyncMessage) {
    // 忽略自己发送的消息
    if (message.tabId === this.tabId) {
      return;
    }

    // 防止重复处理（去重）
    const lastTime = this.lastBroadcastTime.get(
      `${message.storeName}-${message.timestamp}`
    );
    if (lastTime && Date.now() - lastTime < 1000) {
      return;
    }
    this.lastBroadcastTime.set(
      `${message.storeName}-${message.timestamp}`,
      Date.now()
    );

    if (message.type === "store-update") {
      const callbacks = this.callbacks.get(message.storeName);
      if (callbacks) {
        callbacks.forEach((callback) => {
          try {
            callback(message.data);
          } catch (error) {
            console.error("执行同步回调失败:", error);
          }
        });
      }
    }
  }

  /**
   * 序列化数据，确保可以被结构化克隆
   */
  private serializeData(data: any): any {
    try {
      // 通过 JSON 序列化和反序列化来清理数据
      return JSON.parse(JSON.stringify(data));
    } catch (error) {
      console.error("数据序列化失败:", error);
      return null;
    }
  }

  /**
   * 使用 localStorage 作为降级方案
   */
  private fallbackToLocalStorage(message: SyncMessage) {
    try {
      localStorage.setItem(
        "music-player-sync-message",
        JSON.stringify(message)
      );
      // 立即清除，避免影响下次同步
      setTimeout(() => {
        try {
          localStorage.removeItem("music-player-sync-message");
        } catch (e) {
          // 忽略清除错误
        }
      }, 100);
    } catch (error) {
      console.error("localStorage 广播失败:", error);
    }
  }

  /**
   * 广播数据更新（带节流）
   */
  broadcast(storeName: string, data: any) {
    // 节流：避免频繁广播
    const now = Date.now();
    const lastTime = this.lastBroadcastTime.get(storeName);
    if (lastTime && now - lastTime < this.THROTTLE_MS) {
      return;
    }
    this.lastBroadcastTime.set(storeName, now);

    // 序列化数据，确保可以被传输
    const serializedData = this.serializeData(data);
    if (serializedData === null) {
      console.warn(`跳过广播 ${storeName}：数据无法序列化`);
      return;
    }

    const message: SyncMessage = {
      type: "store-update",
      storeName,
      data: serializedData,
      timestamp: now,
      tabId: this.tabId,
    };

    // 1. 使用 BroadcastChannel（同域）
    if (this.channel) {
      try {
        this.channel.postMessage(message);
      } catch (error) {
        console.error("BroadcastChannel 发送失败:", error);
        // 如果 BroadcastChannel 失败，尝试使用 localStorage 降级
        this.fallbackToLocalStorage(message);
      }
    }

    // 2. 使用 localStorage（同域降级）
    if (!this.channel) {
      this.fallbackToLocalStorage(message);
    }

    // 3. 使用 postMessage 广播到所有 iframe（跨域）
    try {
      const postMessageData = {
        source: "music-player-sync",
        message,
      };
      // 向父窗口发送
      if (window.parent !== window) {
        window.parent.postMessage(postMessageData, "*");
      }
      // 向所有 iframe 发送
      Array.from(document.querySelectorAll("iframe")).forEach((iframe) => {
        iframe.contentWindow?.postMessage(postMessageData, "*");
      });
    } catch (error) {
      // postMessage 可能失败，忽略错误
    }
  }

  /**
   * 订阅某个 store 的更新
   */
  subscribe(storeName: string, callback: SyncCallback) {
    if (!this.callbacks.has(storeName)) {
      this.callbacks.set(storeName, new Set());
    }
    this.callbacks.get(storeName)!.add(callback);

    // 返回取消订阅函数
    return () => {
      const callbacks = this.callbacks.get(storeName);
      if (callbacks) {
        callbacks.delete(callback);
      }
    };
  }

  /**
   * 清理资源
   */
  destroy() {
    if (this.channel) {
      this.channel.close();
      this.channel = null;
    }
    if (this.storageListener) {
      window.removeEventListener("storage", this.storageListener);
      this.storageListener = null;
    }
    if (this.messageListener) {
      window.removeEventListener("message", this.messageListener);
      this.messageListener = null;
    }
    this.callbacks.clear();
    this.lastBroadcastTime.clear();
  }

  /**
   * 获取当前标签页 ID
   */
  getTabId() {
    return this.tabId;
  }
}

// 导出单例
export const tabSync = new TabSync();
