import type { NextApiRequest, NextApiResponse } from 'next';

// In-memory storage for feedback (no database for MVP)
const feedbackStore = new Map<string, { helpful: number; unhelpful: number }>();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messageId, feedback } = req.body;

    if (!messageId || !feedback) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (feedback !== 'helpful' && feedback !== 'unhelpful') {
      return res.status(400).json({ error: 'Invalid feedback type' });
    }

    // Get or create feedback entry for this message
    const currentFeedback = feedbackStore.get(messageId) || { helpful: 0, unhelpful: 0 };
    
    // Update feedback count
    if (feedback === 'helpful') {
      currentFeedback.helpful += 1;
    } else {
      currentFeedback.unhelpful += 1;
    }
    
    feedbackStore.set(messageId, currentFeedback);

    // Calculate feedback stats
    const total = currentFeedback.helpful + currentFeedback.unhelpful;
    const helpfulPercentage = total > 0 ? Math.round((currentFeedback.helpful / total) * 100) : 0;

    console.log(`Feedback received: ${feedback === 'helpful' ? '👍' : '👎'} for message ${messageId}`);
    console.log(`Feedback stats: ${currentFeedback.helpful}/${total} helpful (${helpfulPercentage}%)`);

    res.status(200).json({
      success: true,
      messageId,
      feedback,
      stats: {
        helpful: currentFeedback.helpful,
        unhelpful: currentFeedback.unhelpful,
        total,
        helpfulPercentage
      }
    });
  } catch (error: any) {
    console.error('Feedback error:', error);
    res.status(500).json({ error: 'Failed to save feedback' });
  }
} 