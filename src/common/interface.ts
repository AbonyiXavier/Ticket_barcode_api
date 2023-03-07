export interface ticketResponse {
    status: string;
    message: string;
    data: Record<string, any> | Record<string, any>[] | null;
}