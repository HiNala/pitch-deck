import React, { useState, useEffect } from 'react';
import { 
  Share2, 
  Copy, 
  Eye, 
  MessageSquare, 
  Edit3, 
  Calendar, 
  Lock, 
  Users, 
  BarChart3, 
  Download, 
  Mail, 
  Link2, 
  Settings, 
  Clock, 
  Shield, 
  Activity,
  X,
  Check,
  AlertCircle,
  Plus,
  Trash2,
  Globe,
  UserCheck,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SharePermission {
  id: string;
  type: 'view' | 'comment' | 'edit';
  label: string;
  description: string;
  icon: React.ReactNode;
}

interface SharedUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  permission: 'view' | 'comment' | 'edit';
  addedAt: Date;
  lastAccessed?: Date;
}

interface ShareLink {
  id: string;
  url: string;
  customUrl?: string;
  permission: 'view' | 'comment' | 'edit';
  expiresAt?: Date;
  password?: string;
  isPublic: boolean;
  createdAt: Date;
  accessCount: number;
}

interface AnalyticsData {
  totalViews: number;
  uniqueViewers: number;
  avgTimeSpent: number;
  engagementRate: number;
  recentActivity: ActivityLog[];
  viewsByDay: { date: string; views: number }[];
  topPages: { page: number; views: number }[];
}

interface ActivityLog {
  id: string;
  user: string;
  action: string;
  timestamp: Date;
  details?: string;
}

interface SharingModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  presentationTitle?: string;
  presentationId?: string;
  currentUser?: {
    id: string;
    name: string;
    email: string;
  };
}

const SharingModal: React.FC<SharingModalProps> = ({
  isOpen = true,
  onClose = () => {},
  presentationTitle = "Q4 Business Review Presentation",
  presentationId = "pres_123456",
  currentUser = {
    id: "user_1",
    name: "John Doe",
    email: "john@company.com"
  }
}) => {
  const [activeTab, setActiveTab] = useState<'share' | 'links' | 'analytics'>('share');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Share tab state
  const [emailInput, setEmailInput] = useState('');
  const [selectedPermission, setSelectedPermission] = useState<'view' | 'comment' | 'edit'>('view');
  const [shareMessage, setShareMessage] = useState('');
  const [sharedUsers, setSharedUsers] = useState<SharedUser[]>([
    {
      id: '1',
      email: 'sarah@company.com',
      name: 'Sarah Wilson',
      permission: 'edit',
      addedAt: new Date('2024-01-15'),
      lastAccessed: new Date('2024-01-20')
    },
    {
      id: '2',
      email: 'mike@partner.com',
      name: 'Mike Johnson',
      permission: 'comment',
      addedAt: new Date('2024-01-18'),
      lastAccessed: new Date('2024-01-19')
    }
  ]);

  // Links tab state
  const [shareLinks, setShareLinks] = useState<ShareLink[]>([
    {
      id: '1',
      url: 'https://app.pitchdeck.com/share/abc123',
      customUrl: 'q4-review-2024',
      permission: 'view',
      expiresAt: new Date('2024-02-15'),
      isPublic: true,
      createdAt: new Date('2024-01-15'),
      accessCount: 47
    }
  ]);
  const [newLinkPermission, setNewLinkPermission] = useState<'view' | 'comment' | 'edit'>('view');
  const [newLinkExpiry, setNewLinkExpiry] = useState<string>('');
  const [newLinkPassword, setNewLinkPassword] = useState('');
  const [newLinkCustomUrl, setNewLinkCustomUrl] = useState('');

  // Analytics state
  const [analyticsData] = useState<AnalyticsData>({
    totalViews: 234,
    uniqueViewers: 89,
    avgTimeSpent: 4.2,
    engagementRate: 73,
    recentActivity: [
      {
        id: '1',
        user: 'Sarah Wilson',
        action: 'Viewed presentation',
        timestamp: new Date('2024-01-20T10:30:00'),
        details: 'Spent 6 minutes on slide 5'
      },
      {
        id: '2',
        user: 'Mike Johnson',
        action: 'Added comment',
        timestamp: new Date('2024-01-20T09:15:00'),
        details: 'Commented on slide 3'
      },
      {
        id: '3',
        user: 'Anonymous',
        action: 'Viewed via link',
        timestamp: new Date('2024-01-19T16:45:00'),
        details: 'Public link access'
      }
    ],
    viewsByDay: [
      { date: '2024-01-15', views: 12 },
      { date: '2024-01-16', views: 18 },
      { date: '2024-01-17', views: 25 },
      { date: '2024-01-18', views: 31 },
      { date: '2024-01-19', views: 28 },
      { date: '2024-01-20', views: 35 }
    ],
    topPages: [
      { page: 1, views: 89 },
      { page: 5, views: 67 },
      { page: 3, views: 54 },
      { page: 8, views: 43 },
      { page: 12, views: 38 }
    ]
  });

  const permissions: SharePermission[] = [
    {
      id: 'view',
      type: 'view',
      label: 'Can view',
      description: 'View presentation only',
      icon: <Eye className="w-4 h-4" />
    },
    {
      id: 'comment',
      type: 'comment',
      label: 'Can comment',
      description: 'View and add comments',
      icon: <MessageSquare className="w-4 h-4" />
    },
    {
      id: 'edit',
      type: 'edit',
      label: 'Can edit',
      description: 'Full editing access',
      icon: <Edit3 className="w-4 h-4" />
    }
  ];

  const handleAddUser = async () => {
    if (!emailInput.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: SharedUser = {
        id: Date.now().toString(),
        email: emailInput.trim(),
        name: emailInput.split('@')[0],
        permission: selectedPermission,
        addedAt: new Date()
      };
      
      setSharedUsers(prev => [...prev, newUser]);
      setEmailInput('');
      setSuccess('User added successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to add user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveUser = (userId: string) => {
    setSharedUsers(prev => prev.filter(user => user.id !== userId));
  };

  const handleUpdateUserPermission = (userId: string, permission: 'view' | 'comment' | 'edit') => {
    setSharedUsers(prev => 
      prev.map(user => 
        user.id === userId ? { ...user, permission } : user
      )
    );
  };

  const handleCreateLink = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newLink: ShareLink = {
        id: Date.now().toString(),
        url: `https://app.pitchdeck.com/share/${Math.random().toString(36).substr(2, 9)}`,
        customUrl: newLinkCustomUrl || undefined,
        permission: newLinkPermission,
        expiresAt: newLinkExpiry ? new Date(newLinkExpiry) : undefined,
        password: newLinkPassword || undefined,
        isPublic: !newLinkPassword,
        createdAt: new Date(),
        accessCount: 0
      };
      
      setShareLinks(prev => [...prev, newLink]);
      setNewLinkCustomUrl('');
      setNewLinkExpiry('');
      setNewLinkPassword('');
      setSuccess('Share link created successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to create link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setSuccess('Link copied to clipboard');
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      setError('Failed to copy link');
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background border border-border rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Share2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Share Presentation</h2>
              <p className="text-sm text-muted-foreground">{presentationTitle}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mx-6 mt-4">
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}
        
        {success && (
          <div className="mx-6 mt-4">
            <Alert>
              <Check className="w-4 h-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex px-6">
            {[
              { id: 'share', label: 'Share with People', icon: Users },
              { id: 'links', label: 'Share Links', icon: Link2 },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'share' && (
            <div className="space-y-6">
              {/* Add People */}
              <Card className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    <h3 className="font-medium">Add People</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <Input
                        placeholder="Enter email addresses..."
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddUser()}
                      />
                    </div>
                    <div className="flex gap-2">
                      <select
                        value={selectedPermission}
                        onChange={(e) => setSelectedPermission(e.target.value as any)}
                        className="flex-1 px-3 py-2 bg-background border border-border rounded-md text-sm"
                      >
                        {permissions.map(perm => (
                          <option key={perm.id} value={perm.type}>
                            {perm.label}
                          </option>
                        ))}
                      </select>
                      <Button 
                        onClick={handleAddUser} 
                        disabled={isLoading || !emailInput.trim()}
                        size="sm"
                      >
                        {isLoading ? (
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Textarea
                    placeholder="Add a message (optional)"
                    value={shareMessage}
                    onChange={(e) => setShareMessage(e.target.value)}
                    rows={2}
                  />
                </div>
              </Card>

              {/* Shared Users */}
              <div className="space-y-3">
                <h3 className="font-medium flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-primary" />
                  People with Access ({sharedUsers.length})
                </h3>
                
                {sharedUsers.map(user => (
                  <Card key={user.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-primary/10 text-primary font-medium text-sm">
                            {user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                          <p className="text-xs text-muted-foreground">
                            Added {formatTimeAgo(user.addedAt)}
                            {user.lastAccessed && ` • Last accessed ${formatTimeAgo(user.lastAccessed)}`}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <select
                          value={user.permission}
                          onChange={(e) => handleUpdateUserPermission(user.id, e.target.value as any)}
                          className="px-2 py-1 bg-background border border-border rounded text-xs"
                        >
                          {permissions.map(perm => (
                            <option key={perm.id} value={perm.type}>
                              {perm.label}
                            </option>
                          ))}
                        </select>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveUser(user.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'links' && (
            <div className="space-y-6">
              {/* Create New Link */}
              <Card className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Link2 className="w-4 h-4 text-primary" />
                    <h3 className="font-medium">Create Share Link</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs">Permission Level</Label>
                      <select
                        value={newLinkPermission}
                        onChange={(e) => setNewLinkPermission(e.target.value as any)}
                        className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm mt-1"
                      >
                        {permissions.map(perm => (
                          <option key={perm.id} value={perm.type}>
                            {perm.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <Label className="text-xs">Expiration Date (Optional)</Label>
                      <Input
                        type="date"
                        value={newLinkExpiry}
                        onChange={(e) => setNewLinkExpiry(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-xs">Custom URL (Optional)</Label>
                      <Input
                        placeholder="custom-name"
                        value={newLinkCustomUrl}
                        onChange={(e) => setNewLinkCustomUrl(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-xs">Password Protection (Optional)</Label>
                      <Input
                        type="password"
                        placeholder="Enter password"
                        value={newLinkPassword}
                        onChange={(e) => setNewLinkPassword(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  
                  <Button onClick={handleCreateLink} disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <Plus className="w-4 h-4 mr-2" />
                    )}
                    Create Share Link
                  </Button>
                </div>
              </Card>

              {/* Existing Links */}
              <div className="space-y-3">
                <h3 className="font-medium flex items-center gap-2">
                  <Globe className="w-4 h-4 text-primary" />
                  Active Share Links ({shareLinks.length})
                </h3>
                
                {shareLinks.map(link => (
                  <Card key={link.id} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={link.isPublic ? "default" : "secondary"}>
                              {link.isPublic ? 'Public' : 'Private'}
                            </Badge>
                            <Badge variant="outline">
                              {permissions.find(p => p.type === link.permission)?.label}
                            </Badge>
                            {link.password && (
                              <Badge variant="outline">
                                <Lock className="w-3 h-3 mr-1" />
                                Protected
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm font-mono bg-muted px-2 py-1 rounded truncate">
                            {link.customUrl ? `pitchdeck.com/p/${link.customUrl}` : link.url}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {link.accessCount} views
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Created {formatTimeAgo(link.createdAt)}
                            </span>
                            {link.expiresAt && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Expires {formatTimeAgo(link.expiresAt)}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopyLink(link.customUrl ? `https://pitchdeck.com/p/${link.customUrl}` : link.url)}
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            Copy
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Settings className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Overview Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-blue-500" />
                    <div>
                      <p className="text-2xl font-bold">{analyticsData.totalViews}</p>
                      <p className="text-xs text-muted-foreground">Total Views</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold">{analyticsData.uniqueViewers}</p>
                      <p className="text-xs text-muted-foreground">Unique Viewers</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <div>
                      <p className="text-2xl font-bold">{analyticsData.avgTimeSpent}m</p>
                      <p className="text-xs text-muted-foreground">Avg. Time</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-purple-500" />
                    <div>
                      <p className="text-2xl font-bold">{analyticsData.engagementRate}%</p>
                      <p className="text-xs text-muted-foreground">Engagement</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Views Chart */}
              <Card className="p-4">
                <h3 className="font-medium mb-4 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  Views Over Time
                </h3>
                <div className="h-32 flex items-end gap-2">
                  {analyticsData.viewsByDay.map((day, index) => (
                    <div key={day.date} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-primary/20 rounded-t"
                        style={{ height: `${(day.views / 40) * 100}%` }}
                      />
                      <span className="text-xs text-muted-foreground mt-1">
                        {new Date(day.date).getDate()}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Top Pages */}
              <Card className="p-4">
                <h3 className="font-medium mb-4">Most Viewed Slides</h3>
                <div className="space-y-2">
                  {analyticsData.topPages.map(page => (
                    <div key={page.page} className="flex items-center justify-between">
                      <span className="text-sm">Slide {page.page}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${(page.views / analyticsData.topPages[0].views) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-8">{page.views}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Recent Activity */}
              <Card className="p-4">
                <h3 className="font-medium mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" />
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {analyticsData.recentActivity.map(activity => (
                    <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-border last:border-0">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium">{activity.user}</span> {activity.action}
                        </p>
                        {activity.details && (
                          <p className="text-xs text-muted-foreground">{activity.details}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {formatTimeAgo(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/30">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4" />
            <span>Shared content is encrypted and secure</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button>
              <Download className="w-4 h-4 mr-2" />
              Export Analytics
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharingModal; 