export interface User {
    user: {
        id: number,
        first_name: string,
        last_name: string,
        status: string,
        avatar: string,
        phone_number: string,
        token: string,
        expiresIn: number,
        success: boolean,
    }
}
