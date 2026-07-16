// Single accessor for résumé data. resume.json is a generated mirror of
// resume.org (see docs/resume-pipeline.org); nothing else should import the
// JSON directly, so identity/content has exactly one in-code home.
import resume from '../../resume.json';

export type Profile = {
  name: string;
  github: string;
  linkedin: string;
  email: string;
  phone?: string;
  citizenship?: string;
  bio: string;
};
export type Experience = {
  id?: string;
  role: string;
  company: string;
  dates: string;
  subtitle?: string;
  location?: string;
  tech?: string[];
  bullets: string[];
};
export type Project = {
  id?: string;
  name: string;
  timeline: string;
  subtitle?: string;
  tech?: string[];
  bullets: string[];
};
export type Education = {
  id?: string;
  school: string;
  gpa: string;
  graduation: string;
  subtitle?: string;
  degrees: string[];
  honors: string[];
  coursework: string[];
};
export type Organization = {
  id?: string;
  role: string;
  org: string;
  dates: string;
  bullets: string[];
};
export type Publication = {
  id?: string;
  title: string;
  status: string;
  bullets: string[];
};
export type Certification = {
  id?: string;
  name: string;
  issuer?: string;
  date?: string;
};
export type Skills = Record<string, string[]>;

export const profile = resume.profile as Profile;
export const experience = resume.experience as Experience[];
export const projects = resume.projects as Project[];
export const education = resume.education as Education[];
export const organizations = resume.organizations as Organization[];
export const publications = resume.publications as Publication[];
export const certifications = resume.certifications as Certification[];
export const skills = resume.skills as Skills;

// Display label for a skills category key: acronyms (<=2 chars) upper-cased
// whole ("ml" -> "ML"), everything else capitalized ("languages" -> "Languages").
export const catLabel = (c: string) =>
  c.length <= 2 ? c.toUpperCase() : c[0].toUpperCase() + c.slice(1);

export default resume;
