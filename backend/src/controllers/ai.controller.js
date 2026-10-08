import geminiService from '../services/gemini.service.js';
import { Candidate } from '../models/Candidate.js';

export const screenResume = async (req, res) => {
  try {
    const { jobDescription, resumeText, skills, jobTitle } = req.body;
    if (!jobDescription || !resumeText) {
      return res.status(400).json({ error: 'Missing jobDescription or resumeText' });
    }

    const result = await geminiService.screenResume(
      jobDescription,
      resumeText,
      skills || '',
      jobTitle || ''
    );
    res.json(result);
  } catch (e) {
    console.error('AI resume screening error:', e);
    res.status(500).json({ error: 'AI Resume screening failed' });
  }
};

export const getNextInterviewQuestion = async (req, res) => {
  try {
    const { jobTitle, currentRound, history, resumeText } = req.body;
    if (!jobTitle || !currentRound || !history) {
      return res.status(400).json({ error: 'Missing question generation params' });
    }

    // If candidate role, verify interview has not expired
    if (req.user && req.user.role === 'Candidate') {
      const cand = await Candidate.findOne({
        email: req.user.email.toLowerCase(),
        jobTitle
      });
      if (cand && cand.interviewDate && cand.interviewEndTime) {
        const endDateTime = new Date(`${cand.interviewDate}T${cand.interviewEndTime}`);
        if (!isNaN(endDateTime.getTime()) && new Date() > endDateTime) {
          return res.status(403).json({
            error: 'Interview access expired: The scheduled interview window has ended. Please contact HR.'
          });
        }
      }
    }

    const question = await geminiService.getNextInterviewQuestion(
      jobTitle,
      currentRound,
      history,
      resumeText || ''
    );
    res.json({ question });
  } catch (e) {
    console.error('AI question generation error:', e);
    res.status(500).json({ error: 'AI question generation failed' });
  }
};

export const evaluateInterview = async (req, res) => {
  try {
    const { jobTitle, history } = req.body;
    if (!jobTitle || !history) {
      return res.status(400).json({ error: 'Missing evaluation params' });
    }

    const report = await geminiService.evaluateInterview(jobTitle, history);
    res.json(report);
  } catch (e) {
    console.error('AI interview evaluation error:', e);
    res.status(500).json({ error: 'AI interview evaluation failed' });
  }
};

export const askChatbot = async (req, res) => {
  try {
    const { question, context } = req.body;
    if (!question || !context) {
      return res.status(400).json({ error: 'Missing chatbot question or context' });
    }

    const answer = await geminiService.askHRAssistant(question, context);
    res.json({ answer });
  } catch (e) {
    console.error('AI HR Chatbot assistant query error:', e);
    res.status(500).json({ error: 'AI HR Chatbot assistant query failed' });
  }
};

export default {
  screenResume,
  getNextInterviewQuestion,
  evaluateInterview,
  askChatbot
};
