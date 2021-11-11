export interface AuthResponse {
    user: {
        id: number,
        first_name: string,
        last_name: string,
        phone_number: string,
        status: string,
        avatar: string,
        token: string,
        expiresIn: number,
    }
}
