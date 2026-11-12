/** Single place that decides which implementation the app uses.
 *  Replace the mock services with real implementations of AuthApi / ChatApi when the backend exists. */
import type { AuthApi, ChatApi } from './api';
import { mockAuthService } from './mock/authService';
import { mockChatService } from './mock/chatService';

export const authApi: AuthApi = mockAuthService;
export const chatApi: ChatApi = mockChatService;
export { ApiError } from './api';
