export interface WeeklyPayment
{
    id?: string;
    amount?: number | null;
    date_from?: any | null;
    date_to: any | null;
    status: string;
    merchant_name: string;
    merchant_id?: string; 
    admin_id	: string;
    merchant_agreed_at?: any | null;
    admin_agreed_at?: any | null;
    proof_url?: string;
    created_at?: any | null;
}