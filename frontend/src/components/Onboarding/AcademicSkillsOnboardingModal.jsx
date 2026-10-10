// ==============================================================================
// OPPRADAR — SCREEN 2: ONBOARDING & DEEP PROFILE SETUP
// Pristine Breathable Light Theme (#FFFFFF + #E2E8F0 + #1E293B)
// Clean Web Modal Interface (NO device frames, NO notch, NO traffic lights)
// Captures:
// - Profile Photo Selection
// - Role Selection (Tutee vs. Tutor)
// - Academic Year (Freshman, Sophomore, Junior, Senior)
// - Student Specialization & School Details
// - Location
// - Skills Known
// ==============================================================================

import React, { useState } from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  BookOpen, 
  Code, 
  Check, 
  Plus, 
  X, 
  ArrowRight,
  School,
  Calendar,
  Layers,
  MapPin,
  ChevronLeft,
  UserCheck,
  ShieldCheck,
  Briefcase
} from 'lucide-react';
import OppRadarLogo from '../common/OppRadarLogo';

const POPULAR_SKILLS = [
  'Python',
  'JavaScript',
  'React',
  'Node.js',
  'C++',
  'Java',
  'Data Structures & Algorithms',
  'Machine Learning',
  'Generative AI / LLMs',
  'SQL & Databases',
  'Web3 & Blockchain',
  'Flutter / React Native',
  'AWS & Cloud',
  'Git & GitHub',
  'UI/UX Design',
  'Docker & DevOps'
];

const DEGREE_OPTIONS = [
  'B.Tech / B.E. (Bachelor of Technology / Engineering)',
  'BCA (Bachelor of Computer Applications)',
  'B.Sc Computer Science / IT / Data Science',
  'MCA (Master of Computer Applications)',
  'M.Tech / M.E. (Master of Technology)',
  'M.Sc (Master of Science)',
  'Diploma in Engineering',
  'Other Undergraduate Degree',
  'Other Postgraduate Degree'
];

const ACADEMIC_YEARS = [
  { id: '1st', label: '1st Year (Freshman)', desc: 'Exploring core fundamentals & beginner hackathons' },
  { id: '2nd', label: '2nd Year (Sophomore)', desc: 'DSA, open source contributions & early internships' },
  { id: '3rd', label: '3rd Year (Junior)', desc: 'Pre-final year internships, SIH & national grant challenges' },
  { id: '4th', label: '4th Year (Senior)', desc: 'Graduation projects, campus recruitment & deeptech research' }
];

const AVATAR_OPTIONS = [
  { id: 'av-1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', name: 'Profile 1' },
  { id: 'av-2', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80', name: 'Profile 2' },
  { id: 'av-3', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', name: 'Profile 3' },
  { id: 'av-4', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', name: 'Profile 4' }
];

export default function AcademicSkillsOnboardingModal({
  isOpen,
  onClose,
  onSave,
  initialProfile
}) {
  const [step, setStep] = useState(1); // 1: Profile & Photo, 2: Role (Tutee vs. Tutor), 3: Academic & Skills

  // Step 1: Profile & Bio
  const [fullName, setFullName] = useState(initialProfile?.full_name || initialProfile?.username || 'Aditya Sharma');
  const [selectedAvatar, setSelectedAvatar] = useState(initialProfile?.avatar_url || AVATAR_OPTIONS[0].url);
  const [gender, setGender] = useState('Male'); // 'Male' | 'Female' | 'Other' | 'Prefer not to say'
  const [aboutBio, setAboutBio] = useState('I am an ambitious student with a strong passion for software engineering, artificial intelligence, and competitive hackathons. Looking for high-impact internship opportunities and research grants.');

  // Step 2: Role Selection (Tutee vs. Tutor) & Focus Areas
  const [userRole, setUserRole] = useState('TUTEE'); // 'TUTEE' (Student Explorer) | 'TUTOR' (Mentor / Recruiter)
  const [focusAreas, setFocusAreas] = useState(['AI & Machine Learning', 'Software Engineering', 'DSA']);

  // Step 3: Location & Academic Details
  const [location, setLocation] = useState(initialProfile?.location || 'Bengaluru, India');
  const [schoolCollege, setSchoolCollege] = useState(initialProfile?.college || 'National Institute of Technology');
  const [degree, setDegree] = useState(initialProfile?.degree || 'B.Tech / B.E. (Bachelor of Technology / Engineering)');
  const [specialization, setSpecialization] = useState(initialProfile?.branch || 'Computer Science & Engineering');
  const [academicYear, setAcademicYear] = useState(initialProfile?.yearOfStudy || '3rd Year (Junior)');
  
  // Skills Known
  const [selectedSkills, setSelectedSkills] = useState(
    initialProfile?.skills && initialProfile.skills.length > 0 
      ? initialProfile.skills 
      : ['Python', 'JavaScript', 'React', 'Machine Learning', 'Data Structures & Algorithms']
  );
  const [customSkillInput, setCustomSkillInput] = useState('');

  if (!isOpen) return null;

  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const addCustomSkill = (e) => {
    if (e) e.preventDefault();
    const trimmed = customSkillInput.trim();
    if (trimmed && !selectedSkills.includes(trimmed)) {
      setSelectedSkills([...selectedSkills, trimmed]);
      setCustomSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setSelectedSkills(selectedSkills.filter(s => s !== skill));
  };

  const handleFastFill = () => {
    setFullName('Aditya Sharma');
    setSelectedAvatar(AVATAR_OPTIONS[1].url);
    setGender('Male');
    setUserRole('TUTEE');
    setLocation('Bengaluru, Karnataka, India');
    setSchoolCollege('Indian Institute of Technology');
    setSpecialization('Computer Science & Engineering');
    setAcademicYear('3rd Year (Junior)');
    setSelectedSkills(['Python', 'Machine Learning', 'React', 'Data Structures & Algorithms', 'Generative AI / LLMs', 'SQL & Databases']);
  };

  const handleComplete = (e) => {
    if (e) e.preventDefault();
    const storedEmail = localStorage.getItem('oppradar_user_email') || initialProfile?.email || 'aditya.sharma@gmail.com';
    const updatedProfile = {
      ...initialProfile,
      email: storedEmail,
      full_name: fullName.trim() || 'Student Explorer',
      username: (fullName.trim() || 'Student').split(' ')[0],
      avatar_url: selectedAvatar,
      gender,
      bio: aboutBio,
      role: userRole,
      role_title: userRole === 'TUTEE' ? 'Tutee (Student Explorer)' : 'Tutor (Mentor / Recruiter)',
      location,
      degree,
      college: schoolCollege.trim() || 'National Institute of Technology',
      branch: specialization.trim() || 'Computer Science & Engineering',
      yearOfStudy: academicYear,
      skills: selectedSkills.length > 0 ? selectedSkills : ['Python', 'Problem Solving'],
      existing_skills: selectedSkills.length > 0 ? selectedSkills : ['Python', 'Problem Solving'],
      targetRole: 'Software & AI Explorer',
      hasCompletedOnboarding: true,
      onboardedAt: new Date().toISOString()
    };

    localStorage.setItem('oppradar_onboarded_completed', 'true');
    localStorage.setItem('oppradar_user_email', storedEmail);
    onSave(updatedProfile);
  };

  const firstName = (fullName.trim() || 'Aditya').split(' ')[0];

  return (
    <div 
      className="modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem'
      }}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '92vh',
          backgroundColor: '#ffffff',
          color: '#0f172a',
          borderRadius: '24px',
          boxShadow: '0 20px 45px rgba(0, 0, 0, 0.15)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
      >
        {/* Modal Header Row with Oppradar Logo and Steps */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.2rem 1.75rem',
          borderBottom: '1px solid #e2e8f0',
          backgroundColor: '#ffffff'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <OppRadarLogo size="sm" showWordmark={true} showPoweredBy={false} />
            <span style={{ color: '#cbd5e1' }}>•</span>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#2563eb' }}>
              Step {step} of 3: {step === 1 ? 'Profile & Photo' : step === 2 ? 'Role (Tutee vs. Tutor)' : 'Academic & Skills'}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748b'
            }}
          >
            <X style={{ width: '16px', height: '16px' }} />
          </button>
        </div>

        {/* Clean Progress Indicator Bar */}
        <div style={{ height: '3px', width: '100%', backgroundColor: '#f1f5f9' }}>
          <div style={{
            height: '100%',
            width: step === 1 ? '33.3%' : step === 2 ? '66.6%' : '100%',
            backgroundColor: '#2563eb',
            transition: 'width 0.25s ease'
          }} />
        </div>

        {/* Modal Scrollable Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.75rem 2rem' }}>

          {/* ================================================================ */}
          {/* STEP 1: Profile Photo, Name, Gender, Bio                         */}
          {/* ================================================================ */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.35rem 0' }}>
                  Let's setup your profile now!
                </h2>
                <p style={{ fontSize: '0.86rem', color: '#64748b', margin: 0 }}>
                  Customize your personal identity to present to hackathon organizers and top engineering recruiters.
                </p>
              </div>

              {/* Profile Photo Selector */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.5rem' }}>
                  Profile photo
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <img
                    src={selectedAvatar}
                    alt="Active Profile Photo"
                    style={{
                      width: '74px',
                      height: '74px',
                      borderRadius: '18px',
                      objectFit: 'cover',
                      border: '2.5px solid #2563eb',
                      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
                    }}
                  />

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {AVATAR_OPTIONS.map(av => (
                        <img
                          key={av.id}
                          src={av.url}
                          alt={av.name}
                          onClick={() => setSelectedAvatar(av.url)}
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '10px',
                            objectFit: 'cover',
                            cursor: 'pointer',
                            border: selectedAvatar === av.url ? '2px solid #2563eb' : '1px solid #e2e8f0',
                            transition: 'all 0.15s ease'
                          }}
                        />
                      ))}
                    </div>
                    <span style={{ fontSize: '0.76rem', color: '#2563eb', fontWeight: 700 }}>
                      Select photo or use verified student avatar
                    </span>
                  </div>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.35rem' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aditya Sharma"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.7rem 1rem',
                    borderRadius: '12px',
                    border: '1.5px solid #e2e8f0',
                    backgroundColor: '#ffffff',
                    fontSize: '0.9rem',
                    color: '#0f172a',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Gender Selection */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.45rem' }}>
                  Select your gender
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                  {[
                    { id: 'Male', label: '♂ Male' },
                    { id: 'Female', label: '♀ Female' },
                    { id: 'Other', label: '⚥ Other' },
                    { id: 'Prefer not to say', label: 'Prefer not to say' }
                  ].map(item => {
                    const isSel = gender === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setGender(item.id)}
                        style={{
                          padding: '0.65rem 0.5rem',
                          borderRadius: '12px',
                          border: isSel ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                          backgroundColor: isSel ? '#eff6ff' : '#ffffff',
                          color: isSel ? '#2563eb' : '#334155',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bio / Tell about yourself */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.35rem' }}>
                  Tell about yourself
                </label>
                <textarea
                  rows={3}
                  value={aboutBio}
                  onChange={e => setAboutBio(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.7rem 1rem',
                    borderRadius: '12px',
                    border: '1.5px solid #e2e8f0',
                    backgroundColor: '#ffffff',
                    fontSize: '0.84rem',
                    color: '#1e293b',
                    outline: 'none',
                    resize: 'none',
                    lineHeight: 1.5,
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Step 1 Next Button */}
              <button
                type="button"
                onClick={() => setStep(2)}
                style={{
                  padding: '0.85rem',
                  borderRadius: '12px',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '0.94rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)',
                  marginTop: '0.5rem',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#1d4ed8'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#2563eb'; }}
              >
                <span>Next: Select Role (Tutee vs. Tutor)</span>
                <ArrowRight style={{ width: '16px', height: '16px' }} />
              </button>
            </div>
          )}

          {/* ================================================================ */}
          {/* STEP 2: Role Selection (Tutee vs. Tutor) & Focus Areas          */}
          {/* ================================================================ */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.35rem 0' }}>
                  {firstName}, what would you like to be on Oppradar?
                </h2>
                <p style={{ fontSize: '0.86rem', color: '#64748b', margin: 0 }}>
                  A clear profile role enables calibrated match ranking for hackathons, internships, and grants.
                </p>
              </div>

              {/* Role Cards: Tutee vs. Tutor */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div
                  onClick={() => setUserRole('TUTEE')}
                  style={{
                    padding: '1.25rem',
                    borderRadius: '16px',
                    border: userRole === 'TUTEE' ? '2px solid #2563eb' : '1px solid #e2e8f0',
                    backgroundColor: userRole === 'TUTEE' ? '#eff6ff' : '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.65rem',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: userRole === 'TUTEE' ? '#2563eb' : '#f1f5f9',
                    color: userRole === 'TUTEE' ? '#ffffff' : '#475569',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <GraduationCap style={{ width: '22px', height: '22px' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 900, color: userRole === 'TUTEE' ? '#2563eb' : '#0f172a' }}>
                      I'm Tutee
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px', lineHeight: 1.4 }}>
                      Student Explorer seeking hackathons, internships, research grants, and learning guidance.
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => setUserRole('TUTOR')}
                  style={{
                    padding: '1.25rem',
                    borderRadius: '16px',
                    border: userRole === 'TUTOR' ? '2px solid #2563eb' : '1px solid #e2e8f0',
                    backgroundColor: userRole === 'TUTOR' ? '#eff6ff' : '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.65rem',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: userRole === 'TUTOR' ? '#2563eb' : '#f1f5f9',
                    color: userRole === 'TUTOR' ? '#ffffff' : '#475569',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Briefcase style={{ width: '22px', height: '22px' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 900, color: userRole === 'TUTOR' ? '#2563eb' : '#0f172a' }}>
                      I'm Tutor
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px', lineHeight: 1.4 }}>
                      Mentor or Recruiter reviewing candidates, offering guidance, or conducting technical hackathons.
                    </div>
                  </div>
                </div>
              </div>

              {/* Interest Areas */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.45rem' }}>
                  Target Interest Areas
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                  {['Science', 'Mathematics', 'Generative AI', 'Full Stack', 'Cloud & DevOps', 'Cybersecurity', 'Web3 & Blockchain', 'Robotics'].map(item => {
                    const isSel = focusAreas.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          setFocusAreas(isSel ? focusAreas.filter(x => x !== item) : [...focusAreas, item]);
                        }}
                        style={{
                          padding: '0.4rem 0.85rem',
                          borderRadius: '9999px',
                          border: isSel ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                          backgroundColor: isSel ? '#eff6ff' : '#ffffff',
                          color: isSel ? '#2563eb' : '#334155',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Buttons Row */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{
                    padding: '0.85rem 1.25rem',
                    borderRadius: '12px',
                    backgroundColor: '#ffffff',
                    border: '1.5px solid #e2e8f0',
                    color: '#1e293b',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  ← Back
                </button>

                <button
                  type="button"
                  onClick={() => setStep(3)}
                  style={{
                    flex: 1,
                    padding: '0.85rem',
                    borderRadius: '12px',
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '0.94rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)'
                  }}
                >
                  <span>Next: Academic & School Details</span>
                  <ArrowRight style={{ width: '16px', height: '16px' }} />
                </button>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* STEP 3: Academic Year, Specialization, School, Location, Skills  */}
          {/* ================================================================ */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
                    Provide your location & academic details
                  </h2>
                  <p style={{ fontSize: '0.84rem', color: '#64748b', margin: 0 }}>
                    Oppradar matches live hackathon eligibility and grants against these specifics.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleFastFill}
                  style={{
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    color: '#16a34a',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  ⚡ Fast Fill (Demo Profile)
                </button>
              </div>

              {/* Location & School Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '0.3rem' }}>
                    Location (City / State / Country)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <MapPin style={{ width: '15px', height: '15px', color: '#94a3b8', position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Brooklyn, New York / Bengaluru, India"
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem 0.65rem 2.2rem',
                        borderRadius: '10px',
                        border: '1.5px solid #e2e8f0',
                        backgroundColor: '#ffffff',
                        fontSize: '0.86rem',
                        color: '#0f172a',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '0.3rem' }}>
                    School / College / University
                  </label>
                  <div style={{ position: 'relative' }}>
                    <School style={{ width: '15px', height: '15px', color: '#94a3b8', position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Xavier Village Academy / IIT Delhi"
                      value={schoolCollege}
                      onChange={e => setSchoolCollege(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem 0.65rem 2.2rem',
                        borderRadius: '10px',
                        border: '1.5px solid #e2e8f0',
                        backgroundColor: '#ffffff',
                        fontSize: '0.86rem',
                        color: '#0f172a',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Degree Program & Specialization Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '0.3rem' }}>
                    Degree Program
                  </label>
                  <select
                    value={degree}
                    onChange={e => setDegree(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '10px',
                      border: '1.5px solid #e2e8f0',
                      backgroundColor: '#ffffff',
                      fontSize: '0.84rem',
                      color: '#0f172a',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  >
                    {DEGREE_OPTIONS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '0.3rem' }}>
                    Student Specialization / Branch
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Computer Science, AI, Electronics"
                    value={specialization}
                    onChange={e => setSpecialization(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '10px',
                      border: '1.5px solid #e2e8f0',
                      backgroundColor: '#ffffff',
                      fontSize: '0.86rem',
                      color: '#0f172a',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Academic Year Selection Cards */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '0.4rem' }}>
                  Academic Year of Study
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                  {ACADEMIC_YEARS.map(yr => {
                    const isSel = academicYear.includes(yr.id);
                    return (
                      <div
                        key={yr.id}
                        onClick={() => setAcademicYear(yr.label)}
                        style={{
                          padding: '0.65rem 0.85rem',
                          borderRadius: '12px',
                          border: isSel ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                          backgroundColor: isSel ? '#eff6ff' : '#ffffff',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '0.84rem', fontWeight: 800, color: isSel ? '#2563eb' : '#0f172a' }}>
                            {yr.label}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                            {yr.desc}
                          </div>
                        </div>
                        {isSel && (
                          <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#2563eb', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 900 }}>
                            ✓
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Skills Known */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>
                    Skills Known ({selectedSkills.length} selected)
                  </label>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {POPULAR_SKILLS.map(skill => {
                    const isSel = selectedSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        style={{
                          padding: '0.3rem 0.65rem',
                          borderRadius: '9999px',
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          border: isSel ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                          backgroundColor: isSel ? '#2563eb' : '#ffffff',
                          color: isSel ? '#ffffff' : '#334155',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {skill}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Skill Input */}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.45rem' }}>
                  <input
                    type="text"
                    placeholder="Add custom skill (e.g. Next.js, PyTorch)..."
                    value={customSkillInput}
                    onChange={e => setCustomSkillInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCustomSkill();
                      }
                    }}
                    style={{
                      flex: 1,
                      padding: '0.5rem 0.85rem',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      fontSize: '0.8rem',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="button"
                    onClick={addCustomSkill}
                    style={{
                      padding: '0.5rem 0.85rem',
                      borderRadius: '8px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      color: '#1e293b',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Complete & Launch Oppradar Buttons Row */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  style={{
                    padding: '0.85rem 1.25rem',
                    borderRadius: '12px',
                    backgroundColor: '#ffffff',
                    border: '1.5px solid #e2e8f0',
                    color: '#1e293b',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  ← Back
                </button>

                <button
                  type="button"
                  onClick={handleComplete}
                  style={{
                    flex: 1,
                    padding: '0.85rem',
                    borderRadius: '12px',
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '0.94rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)',
                    transition: 'background-color 0.15s ease'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#1d4ed8'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#2563eb'; }}
                >
                  <span>Complete & Launch Oppradar</span>
                  <ArrowRight style={{ width: '16px', height: '16px' }} />
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
