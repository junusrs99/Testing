import { useState, useEffect } from 'react';
import axios from 'axios';
import { TrophyIcon, CheckIcon } from '../components/Icons';
import { getDefaultAchievements, getDefaultAchievementStats } from '../utils/mockData';

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const [achievementsRes, statsRes] = await Promise.all([
        axios.get('/api/achievements').catch(() => ({ data: { data: getDefaultAchievements() } })),
        axios.get('/api/achievements/stats').catch(() => ({ data: { data: getDefaultAchievementStats() } })),
      ]);
      setAchievements(achievementsRes.data.data || achievementsRes.data || getDefaultAchievements());
      setStats(statsRes.data.data || statsRes.data || getDefaultAchievementStats());
    } catch (error) {
      console.error('Error fetching achievements:', error);
      setAchievements(getDefaultAchievements());
      setStats(getDefaultAchievementStats());
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const unlockedAchievements = achievements.filter((a) => a.unlocked);
  const lockedAchievements = achievements.filter((a) => !a.unlocked);

  const getAchievementColor = (rarity) => {
    switch (rarity) {
      case 'legendary':
        return { bg: 'bg-red-100', border: 'border-red-500', text: 'text-red-700', icon: 'text-red-600' };
      case 'epic':
        return { bg: 'bg-purple-100', border: 'border-purple-500', text: 'text-purple-700', icon: 'text-purple-600' };
      case 'rare':
        return { bg: 'bg-blue-100', border: 'border-blue-500', text: 'text-blue-700', icon: 'text-blue-600' };
      case 'common':
        return { bg: 'bg-green-100', border: 'border-green-500', text: 'text-green-700', icon: 'text-green-600' };
      default:
        return { bg: 'bg-gray-100', border: 'border-gray-500', text: 'text-gray-700', icon: 'text-gray-600' };
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Achievements</h1>
        <p className="text-gray-600 mt-1">Track your financial milestones and accomplishments</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Total Achievements</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{stats.totalAchievements || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Unlocked</p>
            <p className="text-2xl font-bold text-green-600 mt-2">{stats.unlocked || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Points</p>
            <p className="text-2xl font-bold text-yellow-600 mt-2">{stats.totalPoints || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Level</p>
            <p className="text-2xl font-bold text-purple-600 mt-2">{stats.level || 1}</p>
          </div>
        </div>
      )}

      {/* Level Progress */}
      {stats && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Level Progress</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-700">Level {stats.level}</span>
              <span className="font-medium text-gray-700">Level {stats.level + 1}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-primary-600 to-primary-800 h-3 rounded-full"
                style={{ width: `${(stats.currentPoints / stats.pointsNeeded) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">
              {stats.currentPoints} / {stats.pointsNeeded} points to next level
            </p>
          </div>
        </div>
      )}

      {/* Unlocked Achievements */}
      {unlockedAchievements.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <CheckIcon className="h-5 w-5 text-green-600" />
            <span>Unlocked Achievements ({unlockedAchievements.length})</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {unlockedAchievements.map((achievement) => {
              const colors = getAchievementColor(achievement.rarity);
              return (
                <div
                  key={achievement._id}
                  className={`p-4 border-2 ${colors.border} rounded-lg ${colors.bg} hover:shadow-lg transition-shadow`}
                >
                  <TrophyIcon className={`h-8 w-8 ${colors.icon} mb-2`} />
                  <h3 className="font-semibold text-gray-900 mb-1">{achievement.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 text-xs rounded ${colors.text} ${colors.bg}`}>
                      +{achievement.points} points
                    </span>
                    {achievement.unlockedAt && (
                      <span className="text-xs text-gray-500">
                        {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Locked Achievements */}
      {lockedAchievements.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <TrophyIcon className="h-5 w-5 text-gray-400" />
            <span>Locked Achievements ({lockedAchievements.length})</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {lockedAchievements.map((achievement) => {
              const colors = getAchievementColor(achievement.rarity);
              return (
                <div
                  key={achievement._id}
                  className="p-4 border border-gray-200 rounded-lg opacity-60 grayscale hover:opacity-80 transition-opacity"
                >
                  <TrophyIcon className="h-8 w-8 text-gray-400 mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-1">{achievement.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                  {achievement.progress !== undefined && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gray-400 h-2 rounded-full"
                          style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {achievement.progress}/{achievement.target}
                      </p>
                    </div>
                  )}
                  <span className="inline-block mt-2 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                    +{achievement.points} points
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Achievements Timeline */}
      {unlockedAchievements.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Achievements</h2>
          <div className="space-y-3">
            {unlockedAchievements
              .sort((a, b) => new Date(b.unlockedAt) - new Date(a.unlockedAt))
              .slice(0, 5)
              .map((achievement) => {
                const colors = getAchievementColor(achievement.rarity);
                return (
                  <div key={achievement._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`p-2 rounded-full ${colors.bg}`}>
                      <TrophyIcon className={`h-5 w-5 ${colors.icon}`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{achievement.name}</p>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">+{achievement.points}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Achievements;
