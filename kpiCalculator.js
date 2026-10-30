/**
 * Faculty KPI Calculation Utility
 * Replicates and integrates the exact formula logic from KpiCalculationService.java
 * Supports dynamic weighted adjustments configured by Administrator
 */

export function calculateTeachingScore(teaching) {
  if (!teaching || !teaching.classesAssigned || !teaching.studentsTotal) {
    return 85.0; // fallback default
  }

  const classCompletion = Math.min(100, (teaching.classesConducted / teaching.classesAssigned) * 100);
  const passPercentage = Math.min(100, (teaching.studentsPassed / teaching.studentsTotal) * 100);
  const attendance = Math.min(100, Number(teaching.attendancePercentage || 0));

  // Teaching score formula: 40% class completion + 30% attendance + 30% pass percentage
  const score = (classCompletion * 0.40) + (attendance * 0.30) + (passPercentage * 0.30);
  return Number(score.toFixed(2));
}

export function calculateResearchScore(research) {
  if (!research) return 70.0;

  // Normalized to 100
  const pubScore = Math.min(100, (Number(research.publications || 0) / 5) * 100);
  const confScore = Math.min(100, (Number(research.conferences || 0) / 4) * 100);
  const patentScore = Math.min(100, (Number(research.patents || 0) / 2) * 100);
  const projectScore = Math.min(100, (Number(research.researchProjects || 0) / 3) * 100);
  const bookScore = Math.min(100, (Number(research.books || 0) / 2) * 100);

  const weighted = (pubScore * 0.30) +
                   (confScore * 0.15) +
                   (patentScore * 0.25) +
                   (projectScore * 0.20) +
                   (bookScore * 0.10);

  return Number(Math.min(100, weighted).toFixed(2));
}

export function calculateFeedbackScore(feedbacks, facultyId) {
  const matching = feedbacks.filter(f => f.facultyId === facultyId);
  if (!matching.length) return 90.0; // default 4.5/5 -> 90%

  const avgRating = matching.reduce((acc, curr) => acc + Number(curr.rating || 0), 0) / matching.length;
  const score = (avgRating / 5) * 100;
  return Number(Math.min(100, score).toFixed(2));
}

export function calculateProfessionalScore(dev) {
  if (!dev) return 75.0;

  const certScore = Math.min(100, (Number(dev.certifications || 0) / 3) * 100);
  const workshopScore = Math.min(100, (Number(dev.workshops || 0) / 5) * 100);
  const fdpScore = Math.min(100, (Number(dev.fdpAttended || 0) / 5) * 100);

  const weighted = (certScore * 0.40) + (workshopScore * 0.30) + (fdpScore * 0.30);
  return Number(Math.min(100, weighted).toFixed(2));
}

export function calculateContributionScore(contrib) {
  if (!contrib) return 80.0;

  const commScore = Math.min(100, (Number(contrib.committeeWork || 0) / 5) * 100);
  const eventScore = Math.min(100, (Number(contrib.eventsConducted || 0) / 5) * 100);
  const mentoringScore = Math.min(100, (Number(contrib.mentoringActivities || 0) / 10) * 100);

  const weighted = (commScore * 0.30) + (eventScore * 0.30) + (mentoringScore * 0.40);
  return Number(Math.min(100, weighted).toFixed(2));
}

export function calculateOverallKpi(faculty, feedbacks = [], weights = {
  teaching: 0.40,
  research: 0.25,
  feedback: 0.15,
  development: 0.10,
  contribution: 0.10,
}) {
  const teachingScore = calculateTeachingScore(faculty.teaching);
  const researchScore = calculateResearchScore(faculty.research);
  const feedbackScore = calculateFeedbackScore(feedbacks, faculty.id);
  const professionalScore = calculateProfessionalScore(faculty.development);
  const contributionScore = calculateContributionScore(faculty.contribution);

  const overall = (teachingScore * weights.teaching) +
                  (researchScore * weights.research) +
                  (feedbackScore * weights.feedback) +
                  (professionalScore * weights.development) +
                  (contributionScore * weights.contribution);

  return {
    facultyId: faculty.id,
    facultyName: faculty.name,
    designation: faculty.designation,
    department: faculty.department,
    teachingScore,
    researchScore,
    feedbackScore,
    professionalScore,
    contributionScore,
    overallScore: Number(overall.toFixed(2)),
    ratingOutOfFive: Number(((feedbackScore / 100) * 5).toFixed(2)),
    grade: overall >= 90 ? 'A+' : overall >= 80 ? 'A' : overall >= 70 ? 'B' : 'C'
  };
}
