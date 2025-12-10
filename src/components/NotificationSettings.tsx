import { useEffect, useState } from 'react';
import { Bell, Mail, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {
  useNotificationPreferences,
  useUpdateNotificationPreferences,
} from '@/hooks/useNotifications';

export const NotificationSettings = () => {
  const { data: preferences, isLoading } = useNotificationPreferences();
  const updateMutation = useUpdateNotificationPreferences();

  const [emailEnabled, setEmailEnabled] = useState(true);
  const [reminder7Days, setReminder7Days] = useState(true);
  const [reminder3Days, setReminder3Days] = useState(true);
  const [reminder1Day, setReminder1Day] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (preferences) {
      setEmailEnabled(preferences.email_enabled);
      setReminder7Days(preferences.reminder_7_days);
      setReminder3Days(preferences.reminder_3_days);
      setReminder1Day(preferences.reminder_1_day);
    }
  }, [preferences]);

  const handleSave = () => {
    updateMutation.mutate({
      email_enabled: emailEnabled,
      reminder_7_days: reminder7Days,
      reminder_3_days: reminder3Days,
      reminder_1_day: reminder1Day,
    });
    setHasChanges(false);
  };

  const handleChange = (setter: (v: boolean) => void, value: boolean) => {
    setter(value);
    setHasChanges(true);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-muted rounded" />
            <div className="h-10 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Settings
        </CardTitle>
        <CardDescription>
          Configure how and when you receive deadline reminders
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email Notifications */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="email-notifications" className="font-medium">
                Email Notifications
              </Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Receive deadline reminders via email
            </p>
          </div>
          <Switch
            id="email-notifications"
            checked={emailEnabled}
            onCheckedChange={(v) => handleChange(setEmailEnabled, v)}
          />
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <Label className="font-medium">Reminder Timing</Label>
          </div>
          <div className="space-y-4 ml-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="reminder-7" className="font-normal">
                  7 days before deadline
                </Label>
                <p className="text-sm text-muted-foreground">
                  Early reminder for planning
                </p>
              </div>
              <Switch
                id="reminder-7"
                checked={reminder7Days}
                onCheckedChange={(v) => handleChange(setReminder7Days, v)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="reminder-3" className="font-normal">
                  3 days before deadline
                </Label>
                <p className="text-sm text-muted-foreground">
                  Mid-point reminder
                </p>
              </div>
              <Switch
                id="reminder-3"
                checked={reminder3Days}
                onCheckedChange={(v) => handleChange(setReminder3Days, v)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="reminder-1" className="font-normal">
                  1 day before deadline
                </Label>
                <p className="text-sm text-muted-foreground">
                  Final reminder
                </p>
              </div>
              <Switch
                id="reminder-1"
                checked={reminder1Day}
                onCheckedChange={(v) => handleChange(setReminder1Day, v)}
              />
            </div>
          </div>
        </div>

        {hasChanges && (
          <Button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="w-full"
          >
            {updateMutation.isPending ? 'Saving...' : 'Save Preferences'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
