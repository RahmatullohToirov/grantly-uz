import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.0";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface UserWithDeadline {
  user_id: string;
  email: string;
  full_name: string;
  scholarship_id: string;
  scholarship_title: string;
  deadline: string;
  days_until: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const today = new Date();
    
    // Calculate dates for 7, 3, and 1 day reminders
    const reminderDays = [7, 3, 1];
    const allReminders: UserWithDeadline[] = [];

    for (const days of reminderDays) {
      const targetDate = new Date(today);
      targetDate.setDate(targetDate.getDate() + days);
      const targetDateStr = targetDate.toISOString().split('T')[0];

      console.log(`Checking for deadlines on ${targetDateStr} (${days} days away)`);

      // Get users with saved scholarships that have deadlines on target date
      const { data: favorites, error: favError } = await supabase
        .from('user_favorites')
        .select(`
          user_id,
          scholarship_id,
          scholarships (
            title,
            deadline
          )
        `)
        .not('scholarships.deadline', 'is', null);

      if (favError) {
        console.error('Error fetching favorites:', favError);
        continue;
      }

      // Get users with applications that have deadlines on target date
      const { data: applications, error: appError } = await supabase
        .from('user_applications')
        .select(`
          user_id,
          scholarship_id,
          scholarships (
            title,
            deadline
          )
        `)
        .not('scholarships.deadline', 'is', null);

      if (appError) {
        console.error('Error fetching applications:', appError);
        continue;
      }

      // Combine and filter for target date
      const combined = [...(favorites || []), ...(applications || [])];
      const uniqueUserScholarships = new Map<string, any>();

      for (const item of combined) {
        const scholarship = item.scholarships as any;
        if (!scholarship?.deadline) continue;
        
        const deadlineDate = scholarship.deadline.split('T')[0];
        if (deadlineDate === targetDateStr) {
          const key = `${item.user_id}-${item.scholarship_id}`;
          if (!uniqueUserScholarships.has(key)) {
            uniqueUserScholarships.set(key, {
              user_id: item.user_id,
              scholarship_id: item.scholarship_id,
              scholarship_title: scholarship.title,
              deadline: scholarship.deadline,
              days_until: days
            });
          }
        }
      }

      // Get user details and preferences
      for (const [_, reminder] of uniqueUserScholarships) {
        // Check user preferences
        const { data: prefs } = await supabase
          .from('notification_preferences')
          .select('*')
          .eq('user_id', reminder.user_id)
          .maybeSingle();

        // Check if user wants this reminder
        const wantsReminder = prefs === null || 
          (days === 7 && prefs.reminder_7_days) ||
          (days === 3 && prefs.reminder_3_days) ||
          (days === 1 && prefs.reminder_1_day);

        if (!wantsReminder) continue;

        // Get user profile and email
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', reminder.user_id)
          .maybeSingle();

        const { data: authUser } = await supabase.auth.admin.getUserById(reminder.user_id);

        if (authUser?.user?.email) {
          allReminders.push({
            ...reminder,
            email: authUser.user.email,
            full_name: profile?.full_name || 'Student'
          });
        }
      }
    }

    console.log(`Found ${allReminders.length} reminders to send`);

    // Send notifications
    for (const reminder of allReminders) {
      // Create in-app notification
      const { error: notifError } = await supabase
        .from('notifications')
        .insert({
          user_id: reminder.user_id,
          title: `Deadline in ${reminder.days_until} day${reminder.days_until > 1 ? 's' : ''}!`,
          message: `The deadline for "${reminder.scholarship_title}" is ${reminder.days_until === 1 ? 'tomorrow' : `in ${reminder.days_until} days`}. Don't miss out!`,
          type: 'deadline',
          scholarship_id: reminder.scholarship_id,
          link: '/scholarships'
        });

      if (notifError) {
        console.error('Error creating notification:', notifError);
      }

      // Check if email is enabled
      const { data: prefs } = await supabase
        .from('notification_preferences')
        .select('email_enabled')
        .eq('user_id', reminder.user_id)
        .maybeSingle();

      const emailEnabled = prefs === null || prefs.email_enabled;

      if (emailEnabled) {
        // Send email
        try {
          const { error: emailError } = await resend.emails.send({
            from: "Scholarship Hub <onboarding@resend.dev>",
            to: [reminder.email],
            subject: `⏰ Deadline Alert: ${reminder.scholarship_title}`,
            html: `
              <!DOCTYPE html>
              <html>
                <head>
                  <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
                    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                    .deadline-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0; }
                    .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
                    .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="header">
                      <h1>⏰ Deadline Reminder</h1>
                    </div>
                    <div class="content">
                      <p>Hi ${reminder.full_name},</p>
                      <p>This is a friendly reminder about an upcoming scholarship deadline:</p>
                      
                      <div class="deadline-box">
                        <strong>${reminder.scholarship_title}</strong><br>
                        <span style="color: #b45309;">Deadline: ${new Date(reminder.deadline).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span><br>
                        <span style="font-size: 18px; font-weight: bold; color: #d97706;">${reminder.days_until} day${reminder.days_until > 1 ? 's' : ''} remaining!</span>
                      </div>
                      
                      <p>Don't miss this opportunity! Make sure to submit your application before the deadline.</p>
                      
                      <p>Good luck! 🍀</p>
                      
                      <div class="footer">
                        <p>You're receiving this because you saved this scholarship. Manage your notification preferences in your profile settings.</p>
                      </div>
                    </div>
                  </div>
                </body>
              </html>
            `,
          });

          if (emailError) {
            console.error('Error sending email:', emailError);
          } else {
            console.log(`Email sent to ${reminder.email} for scholarship ${reminder.scholarship_title}`);
          }
        } catch (e) {
          console.error('Email send error:', e);
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        reminders_sent: allReminders.length 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in send-deadline-reminders:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
