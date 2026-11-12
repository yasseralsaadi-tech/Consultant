import type { AnswerKind, AnswerPayload, Conversation, Lang, LegalSource } from '../../types';
import { APP_CONFIG } from '../../config/app';

/** All text below is DEMONSTRATION content. It contains no real legal articles, laws or dates. */

const sourcesFor = (lang: Lang, n: number): LegalSource[] => {
  const ar = lang === 'ar';
  const items: LegalSource[] = [
    {
      id: 'demo-s1',
      title: ar ? 'مصدر نموذجي ١' : 'Sample source 1',
      lawName: ar ? 'قانون نموذجي (للعرض فقط)' : 'Sample law (display only)',
      articleNo: ar ? 'المادة (س)' : 'Article (X)',
      docType: ar ? 'نص تشريعي نموذجي' : 'Sample legislative text',
      date: '—',
      status: 'inForce',
      excerpt: ar
        ? 'هذا نص نموذجي يمثل موضع نص المادة كما يُخزَّن في قاعدة المعرفة. ليس نصًا قانونيًا حقيقيًا ولا يجوز الاستناد إليه.'
        : 'This is sample text standing in for the article text as stored in the knowledge base. It is not real legal text and must not be relied upon.',
      isDemo: true,
    },
    {
      id: 'demo-s2',
      title: ar ? 'مصدر نموذجي ٢' : 'Sample source 2',
      lawName: ar ? 'قانون نموذجي آخر (للعرض فقط)' : 'Another sample law (display only)',
      articleNo: ar ? 'المادة (ص)' : 'Article (Y)',
      docType: ar ? 'نص تشريعي نموذجي' : 'Sample legislative text',
      date: '—',
      status: 'amended',
      excerpt: ar
        ? 'نص نموذجي ثانٍ لإظهار حالة «معدّلة» في بطاقة المصدر. لا يمثل مادة حقيقية.'
        : 'A second sample text, used to show the "Amended" state on a source card. It does not represent a real article.',
      isDemo: true,
    },
    {
      id: 'demo-s3',
      title: ar ? 'مصدر نموذجي ٣' : 'Sample source 3',
      lawName: ar ? 'وثيقة نموذجية (للعرض فقط)' : 'Sample document (display only)',
      articleNo: '—',
      docType: ar ? 'وثيقة نموذجية' : 'Sample document',
      date: '—',
      status: 'unknown',
      excerpt: ar
        ? 'نص نموذجي ثالث يوضح أن رقم المادة قد لا يتوفر دائمًا لكل مصدر.'
        : 'A third sample text showing that an article number may not always be available for a source.',
      isDemo: true,
    },
  ];
  return items.slice(0, n);
};

const clarifyOptions = (lang: Lang) =>
  lang === 'ar'
    ? [{ id: 'yes', label: 'نعم' }, { id: 'no', label: 'لا' }, { id: 'unsure', label: 'لست متأكدًا' }]
    : [{ id: 'yes', label: 'Yes' }, { id: 'no', label: 'No' }, { id: 'unsure', label: 'Not sure' }];

export interface Scenario {
  kind: AnswerKind;
  payload: AnswerPayload;
  /** Text revealed progressively for normal answers. */
  stream?: { summary: string; application: string };
}

/** Trailing consecutive clarification messages in a conversation. */
function consecutiveClarifications(conv: Conversation): number {
  let n = 0;
  for (let i = conv.messages.length - 1; i >= 0; i--) {
    const m = conv.messages[i];
    if (m.role === 'user') continue;
    if (m.kind === 'clarify') n++; else break;
  }
  return n;
}

export function pickScenario(text: string, conv: Conversation, lang: Lang): Scenario {
  const ar = lang === 'ar';
  const q = text.trim();
  const lower = q.toLowerCase();
  const has = (...words: string[]) => words.some((w) => lower.includes(w.toLowerCase()));

  if (has('error_demo', 'خطأ_تجريبي')) return { kind: 'error', payload: { sources: [] } };
  if (has('model_down_demo', 'تعطل_النموذج')) return { kind: 'fallback', payload: { sources: sourcesFor(lang, 3) } };
  if (has('out_of_scope_demo', 'خارج_النطاق')) return { kind: 'refusal', payload: { sources: [] } };
  if (has('insufficient_demo', 'غير_كاف')) return { kind: 'insufficient', payload: { sources: [] } };

  const prior = consecutiveClarifications(conv);
  const lastAssistantWasClarify = prior > 0;
  const unsure = has('لست متأكد', 'not sure');
  const tooShort = q.length < 18 && !lastAssistantWasClarify;

  if (tooShort || (lastAssistantWasClarify && unsure)) {
    if (prior >= APP_CONFIG.maxClarifications) return { kind: 'insufficient', payload: { sources: [] } };
    const step = prior + 1;
    return {
      kind: 'clarify',
      payload: {
        sources: [],
        clarify: {
          question: step === 1
            ? (ar ? 'هل تتعلق المسألة باتفاق مكتوب بين الطرفين؟' : 'Does the matter involve a written agreement between the parties?')
            : (ar ? 'هل مضى وقت طويل على حدوث الواقعة؟' : 'Did the event happen a long time ago?'),
          options: clarifyOptions(lang),
          step,
          total: APP_CONFIG.maxClarifications,
        },
      },
    };
  }

  return {
    kind: 'answer',
    payload: { sources: sourcesFor(lang, 2) },
    stream: {
      summary: ar
        ? 'هذه خلاصة نموذجية تُظهر كيف ستُعرض الإجابة المختصرة في النسخة الفعلية، بلغة مبسّطة ودون وعود قانونية قاطعة.'
        : 'This is a sample summary showing how the short answer will appear in the real product, in plain language and without absolute legal promises.',
      application: ar
        ? 'هنا يظهر تطبيق النصوص المسترجعة على الوقائع التي ذكرتها، مع التنبيه إلى ما لم تذكره وقد يغيّر النتيجة. يُنصح بمراجعة مختص قبل أي إجراء.'
        : 'Here the retrieved texts are applied to the facts you described, noting what you did not mention and could change the outcome. Consulting a professional before acting is advised.',
    },
  };
}
