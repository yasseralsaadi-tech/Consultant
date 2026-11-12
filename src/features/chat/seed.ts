import type { Conversation, Lang } from '../../types';

/** Two example conversations so a first-time visitor sees a populated history.
 *  They are clearly flagged as examples (isDemoSeed) and contain only demonstration text. */
export function seedConversations(lang: Lang): Conversation[] {
  const ar = lang === 'ar';
  const now = Date.now();
  return [
    {
      id: 'seed_1',
      title: ar ? 'مثال: سؤال عن عقد' : 'Example: a question about a contract',
      createdAt: now - 86400000 * 2,
      updatedAt: now - 86400000 * 2,
      isDemoSeed: true,
      messages: [
        { id: 'seed_1_u', role: 'user', createdAt: now - 86400000 * 2, text: ar ? 'ما الذي ينبغي الانتباه إليه قبل توقيع عقد؟' : 'What should I pay attention to before signing a contract?' },
        {
          id: 'seed_1_a', role: 'assistant', kind: 'answer', status: 'done', createdAt: now - 86400000 * 2, isDemo: true,
          payload: {
            summary: ar ? 'هذه خلاصة نموذجية تُظهر كيف ستُعرض الإجابة المختصرة في النسخة الفعلية، بلغة مبسّطة ودون وعود قانونية قاطعة.' : 'This is a sample summary showing how the short answer will appear in the real product, in plain language and without absolute legal promises.',
            application: ar ? 'هنا يظهر تطبيق النصوص المسترجعة على الوقائع التي ذكرتها، مع التنبيه إلى ما لم تذكره وقد يغيّر النتيجة.' : 'Here the retrieved texts are applied to the facts you described, noting what you did not mention.',
            sources: [{
              id: 'seed-src', title: ar ? 'مصدر نموذجي ١' : 'Sample source 1', lawName: ar ? 'قانون نموذجي (للعرض فقط)' : 'Sample law (display only)',
              articleNo: ar ? 'المادة (س)' : 'Article (X)', docType: ar ? 'نص تشريعي نموذجي' : 'Sample legislative text', date: '—', status: 'inForce',
              excerpt: ar ? 'هذا نص نموذجي يمثل موضع نص المادة. ليس نصًا قانونيًا حقيقيًا.' : 'Sample text standing in for the article text. Not real legal text.', isDemo: true,
            }],
          },
        },
      ],
    },
    {
      id: 'seed_2',
      title: ar ? 'مثال: طلب توضيح' : 'Example: a clarification request',
      createdAt: now - 86400000 * 5,
      updatedAt: now - 86400000 * 5,
      isDemoSeed: true,
      messages: [
        { id: 'seed_2_u', role: 'user', createdAt: now - 86400000 * 5, text: ar ? 'إنهاء اتفاق' : 'Ending an agreement' },
        {
          id: 'seed_2_a', role: 'assistant', kind: 'clarify', status: 'done', createdAt: now - 86400000 * 5, isDemo: true,
          payload: {
            sources: [],
            clarify: {
              question: ar ? 'هل تتعلق المسألة باتفاق مكتوب بين الطرفين؟' : 'Does the matter involve a written agreement between the parties?',
              options: ar ? [{ id: 'yes', label: 'نعم' }, { id: 'no', label: 'لا' }, { id: 'unsure', label: 'لست متأكدًا' }] : [{ id: 'yes', label: 'Yes' }, { id: 'no', label: 'No' }, { id: 'unsure', label: 'Not sure' }],
              step: 1, total: 2,
            },
          },
        },
      ],
    },
  ];
}
