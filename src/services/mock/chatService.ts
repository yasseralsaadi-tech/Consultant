import type { ChatApi } from '../api';
import { sleep } from './delay';
import { pickScenario } from './scenarios';

const words = (s: string) => s.split(/(\s+)/);

/** DEMO ONLY. Simulates a streamed backend: stages -> partial text -> final event. */
export const mockChatService: ChatApi = {
  async ask({ conversation, text, lang }, { onStage, onPartial, onFinal, signal }) {
    const scenario = pickScenario(text, conversation, lang);

    onStage('understand');
    await sleep(600, signal);
    onStage('search');
    await sleep(900, signal);

    if (scenario.kind === 'error') {
      onFinal('error', scenario.payload);
      return;
    }

    if (scenario.stream) {
      onStage('draft');
      await sleep(500, signal);
      let summary = '';
      for (const w of words(scenario.stream.summary)) {
        summary += w;
        onPartial({ summary });
        if (w.trim()) await sleep(28, signal);
      }
      let application = '';
      for (const w of words(scenario.stream.application)) {
        application += w;
        onPartial({ application });
        if (w.trim()) await sleep(28, signal);
      }
      onFinal('answer', { ...scenario.payload, summary: scenario.stream.summary, application: scenario.stream.application });
      return;
    }

    await sleep(300, signal);
    onFinal(scenario.kind, scenario.payload);
  },
};
