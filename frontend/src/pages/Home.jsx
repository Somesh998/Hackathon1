import React, { useState, useEffect } from 'react';
import { NavigationTabs } from '../components/NavigationTabs';
import { DashboardTab } from './DashboardTab';
import { ReelFeedTab } from './ReelFeedTab';
import { InterestProfileTab } from './InterestProfileTab';
import { RecommendationTab } from './RecommendationTab';
import { InteractionHistoryTab } from './InteractionHistoryTab';
import { AIReasoningTab } from './AIReasoningTab';
import { EvaluationTab } from './EvaluationTab';
import apiClient from '../services/api';

export const Home = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [profileData, setProfileData] = useState(null);
  const [evidenceData, setEvidenceData] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inferring, setInferring] = useState(false);

  const userId = 'student_tech_curious_01';

  // Fetch full student context from backend APIs
  const fetchStudentData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Inferred Profile
      const pRes = await apiClient.get(`/api/interests/${userId}`);
      if (pRes.data.success) {
        setProfileData(pRes.data.data);
      }

      // 2. Fetch Evidence Report
      const eRes = await apiClient.get(`/api/interests/evidence/${userId}`);
      if (eRes.data.success) {
        setEvidenceData(eRes.data.data);
      }

      // 3. Fetch Contract Recommendation (Phase 8)
      const rRes = await apiClient.get(`/api/recommendations/generate/${userId}`);
      if (rRes.data.success) {
        setRecommendation(rRes.data);
      }
    } catch (err) {
      console.error('Error loading student context:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, [reloadTrigger]);

  const handleInteract = async (reelId, type) => {
    try {
      await apiClient.post('/api/interactions', {
        userId,
        reelId,
        interactionType: type,
        watchDuration: type === 'VIEW' ? 25 : type === 'SKIP' ? 3 : 15,
        completionRate: type === 'VIEW' ? 0.95 : type === 'SKIP' ? 0.08 : 0.85,
        liked: type === 'LIKE',
        saved: type === 'SAVE',
        shared: type === 'SHARE',
        skipped: type === 'SKIP',
      });
      setReloadTrigger((prev) => prev + 1);
    } catch (err) {
      console.error('Interaction error:', err);
    }
  };

  const handleForceInfer = async () => {
    setInferring(true);
    try {
      await apiClient.post(`/api/interests/infer/${userId}`);
      setReloadTrigger((prev) => prev + 1);
    } catch (err) {
      console.error('Force inference error:', err);
    } finally {
      setInferring(false);
    }
  };

  const handleRegenerateRecommendation = async () => {
    setLoading(true);
    try {
      const res = await apiClient.post(`/api/recommendations/generate/${userId}`);
      if (res.data.success) {
        setRecommendation(res.data);
      }
    } catch (err) {
      console.error('Recommendation regeneration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="main-content">
      {/* 7-Tab Navigation Bar */}
      <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Tab Content Switching */}
      {activeTab === 'dashboard' && (
        <DashboardTab
          evidenceData={evidenceData}
          profileData={profileData}
          recommendation={recommendation}
          onRegenerate={handleRegenerateRecommendation}
          loading={loading}
          setActiveTab={setActiveTab}
        />
      )}

      {activeTab === 'feed' && (
        <ReelFeedTab onInteract={handleInteract} userId={userId} />
      )}

      {activeTab === 'recommendation' && (
        <RecommendationTab
          recommendation={recommendation}
          onRegenerate={handleRegenerateRecommendation}
          loading={loading}
        />
      )}

      {activeTab === 'profile' && (
        <InterestProfileTab
          profileData={profileData}
          evidenceData={evidenceData}
          onForceInfer={handleForceInfer}
          inferring={inferring}
        />
      )}

      {activeTab === 'history' && (
        <InteractionHistoryTab userId={userId} reloadTrigger={reloadTrigger} />
      )}

      {activeTab === 'reasoning' && <AIReasoningTab />}

      {activeTab === 'evaluation' && <EvaluationTab />}
    </main>
  );
};
