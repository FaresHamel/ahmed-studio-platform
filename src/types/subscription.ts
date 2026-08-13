export interface SubscriptionPlan {
    id: string;
    planName: string;
    price: number;
    billingCycle: string;
    title: string;
    features: string;
    subscribers: number;
    status: "active" | "inactive";
    createdAt: string;
}

// TODO: replace with real seed/fetch from GET /subscription-plans once that endpoint exists.
export const MOCK_PLANS: SubscriptionPlan[] = [
    { id: "1", planName: "Pro", price: 29, billingCycle: "Yearly", title: "The complete solution for serious business grant seekers.", features: "Unlimited grant searches, Unlimited saved grants, Advanced filters & sorting, Personalized recommendations, Deadline reminders", subscribers: 120, status: "active", createdAt: "2025-10-06" },
    { id: "2", planName: "Pro", price: 29, billingCycle: "Yearly", title: "The complete solution for serious business grant seekers.", features: "Unlimited grant searches, Unlimited saved grants", subscribers: 85, status: "active", createdAt: "2025-09-01" },
    { id: "3", planName: "Trial", price: 9.99, billingCycle: "Monthly", title: "Try before you commit.", features: "Limited grant searches", subscribers: 45, status: "inactive", createdAt: "2025-08-16" },
    { id: "4", planName: "Trial", price: 0, billingCycle: "01 month", title: "Try before you commit.", features: "Limited grant searches", subscribers: 65, status: "active", createdAt: "2025-07-06" },
    { id: "5", planName: "Standard", price: 0, billingCycle: "01 month", title: "Everything you need to get started.", features: "Standard grant searches", subscribers: 40, status: "active", createdAt: "2025-06-10" },
    { id: "6", planName: "Standard", price: 9.99, billingCycle: "Monthly", title: "Everything you need to get started.", features: "Standard grant searches", subscribers: 25, status: "inactive", createdAt: "2025-05-12" },
];

export const PLAN_NAME_OPTIONS = ["Basic", "Standard", "Pro", "Premium", "Trial"];