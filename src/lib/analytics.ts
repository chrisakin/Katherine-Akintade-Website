import { supabase } from './supabase';

// Generate a unique session ID
const generateSessionId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Track user session
export const trackUserSession = async (page: string) => {
  const sessionId = generateSessionId();
  
  try {
    await supabase
      .from('user_sessions')
      .insert([{
        session_id: sessionId,
        page
      }]);
  } catch (error) {
    console.error('Error tracking session:', error);
  }
};

// Track sales
export const trackSale = async (orderId: string, amount: number) => {
  try {
    await supabase
      .from('sales_tracking')
      .insert([{
        order_id: orderId,
        amount
      }]);
  } catch (error) {
    console.error('Error tracking sale:', error);
  }
};

// Log activity
export const logActivity = async (action: string, details: any) => {
  try {
    await supabase
      .from('activity_logs')
      .insert([{
        action,
        details
      }]);
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

// Get analytics data
export const getAnalytics = async (startDate?: Date, endDate?: Date) => {
  const now = new Date();
  const defaultStartDate = new Date(now.setDate(now.getDate() - 30));
  const start = startDate || defaultStartDate;
  const end = endDate || new Date();

  try {
    // Get active users (sessions > 5 minutes)
    const { data: activeUsers } = await supabase
      .from('user_sessions')
      .select('id')
      .gte('duration', '5 minutes')
      .gte('created_at', start.toISOString())
      .lte('created_at', end.toISOString());

    // Get total sales
    const { data: sales } = await supabase
      .from('sales_tracking')
      .select('amount')
      .gte('created_at', start.toISOString())
      .lte('created_at', end.toISOString());

    // Get recent activities
    const { data: activities } = await supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    // Get sales data for chart
    const { data: salesData } = await supabase
      .from('sales_tracking')
      .select('amount, created_at')
      .gte('created_at', start.toISOString())
      .lte('created_at', end.toISOString())
      .order('created_at', { ascending: true });

    // Get user activity data for chart
    const { data: userActivityData } = await supabase
      .from('user_sessions')
      .select('created_at')
      .gte('created_at', start.toISOString())
      .lte('created_at', end.toISOString())
      .order('created_at', { ascending: true });

    return {
      activeUsers: activeUsers?.length || 0,
      totalSales: sales?.reduce((sum, sale) => sum + sale.amount, 0) || 0,
      activities,
      salesData,
      userActivityData
    };
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return null;
  }
};