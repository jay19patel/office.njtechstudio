'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from "../components/DashboardLayout";
import DashboardStats from '@/components/DashboardStats';
import ProjectList from '@/components/ProjectList';
import VisualAnalytics from '@/components/VisualAnalytics';
import { isDelayed } from '@/utils/timeUtils';

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/data');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  // Calculate stats
  // Returns { total, open, bugs, delayed }
  const countTasks = (tasks = []) => {
    let count = 0;
    let openCount = 0;
    let bugCount = 0;
    let delayedCount = 0;

    tasks.forEach(task => {
      count++;
      if (task.type === 'Bug') bugCount++;
      if (task.status !== 'Done' && task.status !== 'Completed') {
        openCount++;
      }

      // Check delay
      if (isDelayed(task.startDate, task.endDate, task.status)) {
        delayedCount++;
      }

      if (task.subtasks) {
        const { total, open, bugs, delayed } = countTasks(task.subtasks);
        count += total;
        openCount += open;
        bugCount += bugs;
        delayedCount += delayed;
      }
    });
    return { total: count, open: openCount, bugs: bugCount, delayed: delayedCount };
  };

  let totalTasks = 0;
  let openTasks = 0;
  let totalBugs = 0;
  let totalCritical = 0;

  if (data?.projects) {
    data.projects.forEach(p => {
      const { total, open, bugs, delayed } = countTasks(p.tasks);
      totalTasks += total;
      openTasks += open;
      totalBugs += bugs;
      totalCritical += delayed;

      // Also check if project itself is delayed
      if (isDelayed(p.startDate, p.endDate, p.status)) {
        totalCritical++;
      }
    });
  }

  const stats = {
    totalProjects: data?.projects?.length || 0,
    totalTasks,
    openTasks,
    totalBugs,
    totalCritical
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">

        {/* Intro */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
          <p className="text-gray-500">Welcome back! Here's what's happening today.</p>
        </div>

        {/* Stats Grid */}
        <DashboardStats stats={stats} />

        {/* Analytics Graphs */}
        <VisualAnalytics projects={data?.projects} />

      </div>
    </DashboardLayout>
  );
}
