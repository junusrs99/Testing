import { useState } from 'react';
import { UserIcon, SettingsIcon, MessageIcon, LinkIcon, LockIcon } from '../components/Icons';
import { useAuth } from '../contexts/AuthContext';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'notifications', label: 'Notifications', icon: BellIcon },
    { id: 'navigation', label: 'Navigation', icon: HomeIcon },
    { id: 'appearance', label: 'Appearance', icon: PaletteIcon },
    { id: 'message', label: 'Message & Media', icon: MessageIcon },
    { id: 'language', label: 'Language & Region', icon: GlobeIcon },
    { id: 'accessibility', label: 'Accessibility', icon: EyeIcon },
    { id: 'audio', label: 'Audio & Video', icon: VideoIcon },
    { id: 'accounts', label: 'Connected Accounts', icon: LinkIcon },
    { id: 'privacy', label: 'Privacy & Visibility', icon: ShieldIcon },
    { id: 'advanced', label: 'Advanced Features', icon: CogIcon },
    { id: 'security', label: 'Security', icon: LockIcon },
  ];

  const ToggleSwitch = ({ enabled, onChange, label, description }) => (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="font-medium text-gray-900">{label}</p>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" checked={enabled} onChange={onChange} />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
      </label>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary-700">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                      Change Photo
                    </button>
                    <p className="text-xs text-gray-500 mt-1">JPG, PNG or GIF. Max size 2MB</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    defaultValue={user?.name || ''}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    defaultValue={user?.email || ''}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about yourself"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <button className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Email Notifications</h3>
                <div className="space-y-1">
                  <ToggleSwitch enabled={true} label="Account Activity" description="Get notified about account changes" />
                  <ToggleSwitch enabled={true} label="Financial Alerts" description="Receive alerts for important financial events" />
                  <ToggleSwitch enabled={false} label="Marketing Emails" description="Receive updates about new features and offers" />
                  <ToggleSwitch enabled={true} label="Weekly Summary" description="Get a weekly summary of your finances" />
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Push Notifications</h3>
                <div className="space-y-1">
                  <ToggleSwitch enabled={true} label="Bill Reminders" description="Get reminded about upcoming bills" />
                  <ToggleSwitch enabled={true} label="Budget Alerts" description="Alert when approaching budget limits" />
                  <ToggleSwitch enabled={false} label="Investment Updates" description="Get updates on portfolio performance" />
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">SMS Notifications</h3>
                <div className="space-y-1">
                  <ToggleSwitch enabled={false} label="Enable SMS" description="Receive important alerts via SMS" />
                  <ToggleSwitch enabled={false} label="Two-Factor Authentication" description="Use SMS for 2FA codes" />
                </div>
              </div>
            </div>
          </div>
        );

      case 'navigation':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Navigation</h2>
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Sidebar Settings</h3>
                <ToggleSwitch enabled={true} label="Show Sidebar" description="Display navigation sidebar" />
                <ToggleSwitch enabled={false} label="Collapse by Default" description="Start with sidebar collapsed" />
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sidebar Position</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                    <option>Left</option>
                    <option>Right</option>
                  </select>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Breadcrumbs</h3>
                <ToggleSwitch enabled={true} label="Show Breadcrumbs" description="Display navigation breadcrumbs" />
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Appearance</h2>
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Theme</h3>
                <div className="grid grid-cols-3 gap-4">
                  <button className="p-4 border-2 border-primary-500 rounded-lg bg-white">
                    <div className="w-full h-8 bg-gray-100 rounded mb-2"></div>
                    <p className="text-sm font-medium">Light</p>
                  </button>
                  <button className="p-4 border-2 border-gray-200 rounded-lg bg-gray-800">
                    <div className="w-full h-8 bg-gray-700 rounded mb-2"></div>
                    <p className="text-sm font-medium text-white">Dark</p>
                  </button>
                  <button className="p-4 border-2 border-gray-200 rounded-lg bg-white">
                    <div className="w-full h-8 bg-gradient-to-r from-gray-100 to-gray-800 rounded mb-2"></div>
                    <p className="text-sm font-medium">Auto</p>
                  </button>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Font Size</h3>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                  <option>Small</option>
                  <option selected>Medium</option>
                  <option>Large</option>
                  <option>Extra Large</option>
                </select>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Color Scheme</h3>
                <div className="grid grid-cols-4 gap-3">
                  {['Blue', 'Green', 'Purple', 'Orange'].map((color) => (
                    <button key={color} className="p-3 border border-gray-200 rounded-lg hover:border-primary-500">
                      <div className={`w-full h-8 rounded mb-2 bg-${color.toLowerCase()}-500`}></div>
                      <p className="text-xs">{color}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'message':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Message & Media</h2>
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Chat Settings</h3>
                <ToggleSwitch enabled={true} label="Sound Notifications" description="Play sound for new messages" />
                <ToggleSwitch enabled={true} label="Message Preview" description="Show message preview in notifications" />
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Auto-save Chat History</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                    <option>30 days</option>
                    <option>90 days</option>
                    <option>1 year</option>
                    <option>Forever</option>
                  </select>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Media Settings</h3>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image Quality</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Auto-download Media</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                    <option>Never</option>
                    <option>Wi-Fi only</option>
                    <option>Always</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 'language':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Language & Region</h2>
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                    <option>English (US)</option>
                    <option>English (UK)</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                    <option>United States</option>
                    <option>United Kingdom</option>
                    <option>Canada</option>
                    <option>Australia</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                    <option>GBP (£)</option>
                    <option>CAD (C$)</option>
                  </select>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                    <option>MM/DD/YYYY</option>
                    <option>DD/MM/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time Format</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                    <option>12-hour</option>
                    <option>24-hour</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 'accessibility':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Accessibility</h2>
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Display</h3>
                <ToggleSwitch enabled={false} label="High Contrast Mode" description="Increase contrast for better visibility" />
                <ToggleSwitch enabled={false} label="Reduce Motion" description="Minimize animations and transitions" />
                <ToggleSwitch enabled={true} label="Screen Reader Support" description="Optimize for screen readers" />
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Keyboard Navigation</h3>
                <ToggleSwitch enabled={true} label="Keyboard Shortcuts" description="Enable keyboard shortcuts" />
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Shortcut Key</label>
                  <input
                    type="text"
                    defaultValue="Ctrl+K"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'audio':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Audio & Video</h2>
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Audio Settings</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Output Device</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                    <option>Default</option>
                    <option>Headphones</option>
                    <option>Speakers</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Volume</label>
                  <input type="range" min="0" max="100" defaultValue="75" className="w-full" />
                </div>
                <ToggleSwitch enabled={true} label="Mute Sounds" description="Disable all sound effects" />
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Video Settings</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Video Quality</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                    <option>Auto</option>
                    <option>1080p</option>
                    <option>720p</option>
                    <option>480p</option>
                  </select>
                </div>
                <ToggleSwitch enabled={false} label="HD Video" description="Enable high-definition video" />
              </div>
            </div>
          </div>
        );

      case 'accounts':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Connected Accounts</h2>
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-bold">G</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Google</p>
                      <p className="text-sm text-gray-500">Connected</p>
                    </div>
                  </div>
                  <button className="text-red-600 hover:text-red-700">Disconnect</button>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-gray-600 font-bold">A</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Apple</p>
                      <p className="text-sm text-gray-500">Not connected</p>
                    </div>
                  </div>
                  <button className="text-primary-600 hover:text-primary-700">Connect</button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Privacy & Visibility</h2>
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Profile Privacy</h3>
                <ToggleSwitch enabled={true} label="Public Profile" description="Allow others to view your profile" />
                <ToggleSwitch enabled={false} label="Show Email" description="Display email on profile" />
                <ToggleSwitch enabled={true} label="Show Achievements" description="Display achievements publicly" />
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Data Sharing</h3>
                <ToggleSwitch enabled={false} label="Share Analytics" description="Help improve the platform" />
                <ToggleSwitch enabled={false} label="Marketing Data" description="Allow use of data for marketing" />
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Activity Status</h3>
                <ToggleSwitch enabled={true} label="Show Online Status" description="Display when you're active" />
              </div>
            </div>
          </div>
        );

      case 'advanced':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Advanced Features</h2>
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">AI Features</h3>
                <ToggleSwitch enabled={true} label="AI Insights" description="Enable AI-powered financial insights" />
                <ToggleSwitch enabled={true} label="Predictive Analytics" description="Use AI for financial predictions" />
                <ToggleSwitch enabled={false} label="Auto-categorization" description="Automatically categorize transactions" />
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Performance</h3>
                <ToggleSwitch enabled={true} label="Caching" description="Enable data caching for faster loading" />
                <ToggleSwitch enabled={false} label="Background Sync" description="Sync data in the background" />
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Developer Options</h3>
                <ToggleSwitch enabled={false} label="Debug Mode" description="Enable debugging features" />
                <button className="mt-4 text-sm text-primary-600 hover:text-primary-700">
                  Export All Data →
                </button>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Security</h2>
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Password</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <button className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700">
                    Change Password
                  </button>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Two-Factor Authentication</h3>
                <ToggleSwitch enabled={false} label="Enable 2FA" description="Add an extra layer of security" />
                <p className="text-sm text-gray-500 mt-2">Use an authenticator app for secure login</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Active Sessions</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Current Session</p>
                      <p className="text-sm text-gray-500">Windows • Chrome • Last active: Now</p>
                    </div>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Mobile Device</p>
                      <p className="text-sm text-gray-500">iOS • Safari • Last active: 2 hours ago</p>
                    </div>
                    <button className="text-red-600 hover:text-red-700 text-sm">Revoke</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-2 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

// Add missing icons
const BellIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const HomeIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const PaletteIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
  </svg>
);

const GlobeIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const EyeIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const VideoIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const ShieldIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const CogIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export default Settings;
