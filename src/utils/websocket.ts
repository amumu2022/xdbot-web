/**
 * WebSocket客户端类，封装WebSocket连接管理
 * 提供连接初始化、消息收发、重连机制等功能
 * 采用单例模式，确保同一URL只有一个连接实例
 */
class WebSocketClient {
  close_callback: Function | null = null;
  open_callback: Function | null = null;
  receiveMessage: Function | null = null;
  websocket: WebSocket | null = null;
  connectURL: string = "";
  socket_open: boolean = false;
  heart_beat_timer: any = null;
  heart_beat_interval: number = 45000;
  is_reconnect: boolean = true;
  reconnect_count: number = 3;
  reconnect_current: number = 1;
  reconnect_number: number = 0;
  reconnect_timer: any = null;
  reconnect_interval: number = 5000;
  static instances: Map<string, WebSocketClient> = new Map();

  /**
   * 获取当前连接状态
   * @returns {boolean} 返回当前WebSocket连接状态
   */
  isConnected(): boolean {
    return this.socket_open;
  }

  /**
   * 获取WebSocketClient实例（单例模式）
   * @param {string} url - WebSocket连接URL
   * @returns {WebSocketClient} 返回对应URL的WebSocketClient实例
   */
  static getInstance(url: string): WebSocketClient {
    if (!this.instances.has(url)) {
      this.instances.set(url, new WebSocketClient());
    }
    return this.instances.get(url)!;
  }

  /**
   * 关闭所有WebSocket连接
   */
  static closeAll() {
    this.instances.forEach(instance => instance.close());
    this.instances.clear();
  }

  /**
   * 初始化WebSocket连接
   * @param {string} connectURL - WebSocket连接URL
   * @param {Function | null} receiveMessage - 消息接收回调函数
   * @param {Function | null} close_callback - 连接关闭回调函数
   * @param {Function | null} open_callback - 连接成功回调函数
   * @returns {Promise<WebSocket | null>} 返回WebSocket实例的Promise
   */
  async init(
    connectURL: string,
    receiveMessage: Function | null,
    close_callback: Function | null,
    open_callback: Function | null
  ): Promise<WebSocket | null> {
    this.connectURL = connectURL;
    this.receiveMessage = receiveMessage;
    this.close_callback = close_callback;
    this.open_callback = open_callback;

    if (!("WebSocket" in window)) {
      console.error("浏览器不支持WebSocket");
      return null;
    }

    if (this.socket_open) {
      console.warn("请勿重复连接");
      return this.websocket;
    }

    this.websocket = new WebSocket(connectURL);
    this.setupEventHandlers();
    return this.websocket;
  }

  /**
   * 设置WebSocket事件处理器
   */
  private setupEventHandlers() {
    if (!this.websocket) return;

    this.websocket.onmessage = (e: any) => {
      if (this.receiveMessage) {
        this.receiveMessage(e);
      }
    };

    this.websocket.onclose = (e: any) => {
      if (this.close_callback) {
        this.close_callback(e);
      }
      this.handleReconnect();
    };

    this.websocket.onopen = () => {
      this.socket_open = true;
      this.is_reconnect = true;
      if (this.open_callback) {
        this.open_callback(this);
      }
    };

    this.websocket.onerror = () => {
      console.error("socket connect failed");
      this.socket_open = false;
    };
  }

  /**
   * 处理重连逻辑
   */
  private handleReconnect() {
    clearInterval(this.heart_beat_interval);
    this.socket_open = false;

    if (this.is_reconnect) {
      this.reconnect_timer = setTimeout(() => {
        if (this.reconnect_current > this.reconnect_count) {
          clearTimeout(this.reconnect_timer);
          this.is_reconnect = false;
          return;
        }
        this.reconnect_current++;
        this.reconnect();
      }, this.reconnect_interval);
    }
  }

  /**
   * 发送消息
   * @param {any} data - 要发送的数据
   * @param {Function | null} callback - 发送成功后的回调函数
   */
  send(data: any, callback: Function | null = null) {
    if (!this.websocket) return;

    if (this.websocket.readyState === this.websocket.OPEN) {
      this.websocket.send(JSON.stringify(data));
      if (callback) {
        callback();
      }
    } else {
      clearInterval(this.heart_beat_timer);
      if (this.reconnect_number < 1) {
        console.warn("WebSocket 连接中，请耐心等待");
      }
      this.reconnect_number++;
    }
  }

  /**
   * 接收消息
   * @param {any} message - 接收到的消息
   * @returns {any} 返回解析后的消息数据
   */
  receive(message: any) {
    return JSON.parse(message.data).data;
  }

  /**
   * 关闭WebSocket连接
   */
  close() {
    clearInterval(this.heart_beat_interval);
    this.is_reconnect = false;
    this.socket_open = false;
    if (this.websocket) {
      this.websocket.close();
    }
  }

  /**
   * 重新连接WebSocket
   */
  reconnect() {
    if (this.websocket && !this.is_reconnect) {
      this.close();
    }
    this.init(
      this.connectURL,
      this.receiveMessage,
      this.close_callback,
      this.open_callback
    );
  }
}

// 连接状态枚举
enum ConnectStatusCode {
  Success = 0,
  Failure = 1,
  AlreadyConnected = 2
}

// 连接状态接口
interface ConnectStatus {
  code: ConnectStatusCode;
  message?: string;
}

/**
 * 连接WebSocket服务器
 * @param {string} ws_url - WebSocket服务器URL
 * @param {Function} onMessage - 消息接收回调函数
 * @param {Function} [onOpen] - 可选，连接成功回调函数
 * @param {Function} [onClose] - 可选，连接关闭回调函数
 * @param {Function} [onConnectSuccess] - 可选，连接成功后的回调函数
 * @returns {Promise<ConnectStatus>} 返回连接状态
 */
export const connectWs = async (
  ws_url: string,
  onMessage: Function,
  onOpen?: Function,
  onClose?: Function,
  onConnectSuccess?: (socket: WebSocketClient) => Promise<void>
): Promise<ConnectStatus> => {
  const client = WebSocketClient.getInstance(ws_url);

  // 检查是否已经连接
  if (client.isConnected()) {
    return { code: ConnectStatusCode.AlreadyConnected };
  }

  try {
    await client.init(
      ws_url,
      onMessage,
      onClose,
      async (socket: WebSocketClient) => {
        console.log("连接建立成功");

        if (onConnectSuccess) {
          try {
            await onConnectSuccess(socket);
          } catch (error) {
            console.error("在连接成功后执行用户提供的回调时发生错误:", error);
          }
        }

        if (onOpen) {
          onOpen(socket);
        }
      }
    );

    return { code: ConnectStatusCode.Success };
  } catch (error) {
    console.error("WebSocket连接初始化时发生错误:", error);
    return {
      code: ConnectStatusCode.Failure,
      message: error instanceof Error ? error.message : "未知错误"
    };
  }
};

/**
 * 关闭WebSocket连接
 * @param {string} [url] - 可选，指定要关闭的连接URL。如果未提供，则关闭所有连接
 */
export function CloseWs(url?: string) {
  if (url) {
    const client = WebSocketClient.getInstance(url);
    client.close();
  } else {
    WebSocketClient.closeAll();
  }
  console.log("连接已断开");
}

/**
 * WebSocket Hook
 * @returns {Object} 返回WebSocket相关状态和方法
 */
export const useWebSocket = () => {
  return {
    WebSocketClient,
    connectWs,
    CloseWs
  };
};
