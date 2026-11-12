import { useLocation } from 'react-router-dom';

/** Id of the conversation in the URL (`/c/:id`). Read from the path so layout components
 *  (sidebar, top bar) do not depend on how nested route params are exposed. */
export function useActiveConversationId(): string | undefined {
  const { pathname } = useLocation();
  const m = pathname.match(/^\/c\/([^/]+)/);
  return m ? decodeURIComponent(m[1]) : undefined;
}
